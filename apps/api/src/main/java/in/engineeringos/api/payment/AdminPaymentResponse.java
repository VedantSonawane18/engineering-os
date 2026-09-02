package in.engineeringos.api.payment;

import java.time.Instant;

public record AdminPaymentResponse(
    String id,
    String studentId,
    String studentName,
    String studentEmail,
    String method,
    String referenceType,
    String referenceValue,
    String status,
    Instant submittedAt,
    Instant reviewedAt,
    String reviewedByEmail,
    String reviewNote,
    boolean screenshotAvailable
) {

    public static AdminPaymentResponse from(Payment payment) {
        return new AdminPaymentResponse(
            payment.getId().toString(),
            payment.getUser().getId().toString(),
            payment.getUser().getFullName(),
            payment.getUser().getEmail(),
            payment.getMethod().name(),
            payment.getReferenceType().name(),
            payment.getReferenceValue(),
            payment.getStatus().name(),
            payment.getSubmittedAt(),
            payment.getReviewedAt(),
            payment.getReviewedByEmail(),
            payment.getReviewNote(),
            payment.getScreenshotStorageKey() != null
        );
    }
}
