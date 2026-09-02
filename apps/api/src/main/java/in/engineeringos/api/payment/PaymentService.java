package in.engineeringos.api.payment;

import in.engineeringos.api.storage.FileStorageService;
import in.engineeringos.api.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final FileStorageService fileStorageService;

    public PaymentService(
        PaymentRepository paymentRepository,
        FileStorageService fileStorageService
    ) {
        this.paymentRepository = paymentRepository;
        this.fileStorageService = fileStorageService;
    }

    /*
     * ==========================================
     * STUDENT-FACING
     * ==========================================
     */

    @Transactional
    public PaymentResponse submit(
        User user,
        Payment.PaymentMethod method,
        Payment.TransactionReferenceType referenceType,
        String referenceValue,
        MultipartFile screenshot
    ) {

        if (
            referenceValue == null ||
            referenceValue.isBlank()
        ) {
            throw new IllegalArgumentException(
                "A transaction reference is required."
            );
        }

        FileStorageService.StoredFile stored =
            fileStorageService.store("payments", screenshot);

        Payment payment = paymentRepository
            .findByUserId(user.getId())
            .orElseGet(Payment::new);

        String previousKey =
            payment.getScreenshotStorageKey();

        payment.setUser(user);
        payment.setMethod(method);
        payment.setReferenceType(referenceType);
        payment.setReferenceValue(referenceValue.trim());
        payment.setScreenshotStorageKey(stored.storageKey());
        payment.setScreenshotContentType(
            stored.contentType()
        );

        /*
         * A (re)submission always resets review state.
         * This covers the rejected -> resubmitted flow
         * explicitly required by the spec.
         */
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setSubmittedAt(Instant.now());
        payment.setReviewedAt(null);
        payment.setReviewedByEmail(null);
        payment.setReviewNote(null);

        Payment saved = paymentRepository.save(payment);

        if (
            previousKey != null &&
            !previousKey.equals(stored.storageKey())
        ) {
            fileStorageService.delete(previousKey);
        }

        return PaymentResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getForUser(User user) {

        Payment payment = getPaymentEntityForUser(user);

        return PaymentResponse.from(payment);
    }

    @Transactional(readOnly = true)
    public boolean hasSubmission(UUID userId) {
        return paymentRepository
            .findByUserId(userId)
            .isPresent();
    }

    @Transactional(readOnly = true)
    public ScreenshotFile getScreenshotForUser(User user) {

        Payment payment = getPaymentEntityForUser(user);

        return new ScreenshotFile(
            fileStorageService.read(
                payment.getScreenshotStorageKey()
            ),
            payment.getScreenshotContentType()
        );
    }

    private Payment getPaymentEntityForUser(User user) {
        return paymentRepository
            .findByUserId(user.getId())
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "No payment has been submitted yet."
                )
            );
    }

    /*
     * ==========================================
     * ADMIN-FACING
     * ==========================================
     */

    @Transactional(readOnly = true)
    public List<AdminPaymentResponse> getAll(
        Payment.PaymentStatus statusFilter
    ) {

        List<Payment> payments = statusFilter == null
            ? paymentRepository.findAllByOrderBySubmittedAtDesc()
            : paymentRepository
                .findAllByStatusOrderBySubmittedAtDesc(
                    statusFilter
                );

        return payments.stream()
            .map(AdminPaymentResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public AdminPaymentResponse getById(UUID id) {
        return AdminPaymentResponse.from(
            getPaymentEntity(id)
        );
    }

    @Transactional(readOnly = true)
    public AdminPaymentResponse getByStudentId(
        UUID studentId
    ) {
        return paymentRepository
            .findByUserId(studentId)
            .map(AdminPaymentResponse::from)
            .orElse(null);
    }

    @Transactional(readOnly = true)
    public ScreenshotFile getScreenshot(UUID id) {

        Payment payment = getPaymentEntity(id);

        return new ScreenshotFile(
            fileStorageService.read(
                payment.getScreenshotStorageKey()
            ),
            payment.getScreenshotContentType()
        );
    }

    @Transactional
    public AdminPaymentResponse markUnderReview(
        UUID id,
        String adminEmail
    ) {
        return transition(
            id,
            adminEmail,
            Payment.PaymentStatus.UNDER_REVIEW,
            null
        );
    }

    @Transactional
    public AdminPaymentResponse verify(
        UUID id,
        String adminEmail
    ) {
        return transition(
            id,
            adminEmail,
            Payment.PaymentStatus.VERIFIED,
            null
        );
    }

    @Transactional
    public AdminPaymentResponse reject(
        UUID id,
        String adminEmail,
        String note
    ) {
        return transition(
            id,
            adminEmail,
            Payment.PaymentStatus.REJECTED,
            note
        );
    }

    private AdminPaymentResponse transition(
        UUID id,
        String adminEmail,
        Payment.PaymentStatus status,
        String note
    ) {

        Payment payment = getPaymentEntity(id);

        payment.setStatus(status);
        payment.setReviewedAt(Instant.now());
        payment.setReviewedByEmail(adminEmail);
        payment.setReviewNote(note);

        return AdminPaymentResponse.from(
            paymentRepository.save(payment)
        );
    }

    private Payment getPaymentEntity(UUID id) {
        return paymentRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Payment record not found."
                )
            );
    }

    public record ScreenshotFile(
        byte[] bytes,
        String contentType
    ) {}
}
