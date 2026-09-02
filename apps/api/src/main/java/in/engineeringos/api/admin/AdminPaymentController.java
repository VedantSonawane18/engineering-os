package in.engineeringos.api.admin;

import in.engineeringos.api.payment.AdminPaymentResponse;
import in.engineeringos.api.payment.Payment;
import in.engineeringos.api.payment.PaymentService;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/payments")
public class AdminPaymentController {

    private final PaymentService paymentService;

    public AdminPaymentController(
        PaymentService paymentService
    ) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<List<AdminPaymentResponse>> getAll(
        @RequestParam(value = "status", required = false)
        Payment.PaymentStatus status
    ) {
        return ResponseEntity.ok(
            paymentService.getAll(status)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
        @PathVariable UUID id
    ) {
        try {
            return ResponseEntity.ok(
                paymentService.getById(id)
            );
        } catch (IllegalArgumentException exception) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                    exception.getMessage()
                ));
        }
    }

    /*
     * Used by the admin student detail page to show
     * the PAYMENT section without a separate lookup
     * step. Returns 204 (no body) when the student has
     * not submitted a payment yet — this is the
     * "NOT SUBMITTED" state, not an error.
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<AdminPaymentResponse> getByStudent(
        @PathVariable UUID studentId
    ) {

        AdminPaymentResponse response =
            paymentService.getByStudentId(studentId);

        if (response == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/screenshot")
    public ResponseEntity<?> getScreenshot(
        @PathVariable UUID id
    ) {
        try {

            PaymentService.ScreenshotFile file =
                paymentService.getScreenshot(id);

            return ResponseEntity.ok()
                .contentType(
                    MediaType.parseMediaType(
                        file.contentType()
                    )
                )
                .body(file.bytes());

        } catch (IllegalArgumentException exception) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                    exception.getMessage()
                ));
        }
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<?> markUnderReview(
        @PathVariable UUID id,
        Authentication authentication
    ) {
        return respondToTransition(
            () -> paymentService.markUnderReview(
                id,
                authentication.getName()
            )
        );
    }

    @PostMapping("/{id}/verify")
    public ResponseEntity<?> verify(
        @PathVariable UUID id,
        Authentication authentication
    ) {
        return respondToTransition(
            () -> paymentService.verify(
                id,
                authentication.getName()
            )
        );
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(
        @PathVariable UUID id,
        @RequestBody(required = false)
        RejectRequest request,
        Authentication authentication
    ) {
        String note = request == null
            ? null
            : request.note();

        return respondToTransition(
            () -> paymentService.reject(
                id,
                authentication.getName(),
                note
            )
        );
    }

    private ResponseEntity<?> respondToTransition(
        java.util.function.Supplier<AdminPaymentResponse> action
    ) {
        try {
            return ResponseEntity.ok(action.get());
        } catch (IllegalArgumentException exception) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                    exception.getMessage()
                ));
        }
    }

    public record RejectRequest(
        @Size(max = 1000)
        String note
    ) {}

    public record ErrorResponse(String message) {}
}
