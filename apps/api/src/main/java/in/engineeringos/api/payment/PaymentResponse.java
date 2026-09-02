package in.engineeringos.api.payment;

import java.time.Instant;

public record PaymentResponse(
    String id,
    String method,
    String referenceType,
    String referenceValue,
    String status,
    Instant submittedAt,
    Instant reviewedAt,
    String reviewNote,
    boolean screenshotAvailable
) {

    public static PaymentResponse from(Payment payment) {
        return new PaymentResponse(
            payment.getId().toString(),
            payment.getMethod().name(),
            payment.getReferenceType().name(),
            payment.getReferenceValue(),
            payment.getStatus().name(),
            payment.getSubmittedAt(),
            payment.getReviewedAt(),
            payment.getReviewNote(),
            payment.getScreenshotStorageKey() != null
        );
    }
}
