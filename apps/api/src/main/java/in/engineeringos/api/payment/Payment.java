package in.engineeringos.api.payment;

import in.engineeringos.api.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "payments",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_payments_user",
            columnNames = "user_id"
        )
    }
)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /*
     * Engineering OS currently tracks one active
     * payment submission per student. A rejected
     * submission is overwritten by the next one
     * (status resets to PENDING), rather than
     * creating a parallel row.
     */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "user_id",
        nullable = false,
        unique = true
    )
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionReferenceType referenceType;

    @Column(nullable = false)
    private String referenceValue;

    /*
     * Server-generated relative path under the
     * configured upload root. Never derived from
     * user-supplied input.
     */
    @Column(nullable = false)
    private String screenshotStorageKey;

    @Column(nullable = false)
    private String screenshotContentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Column(nullable = false)
    private Instant submittedAt;

    @Column(nullable = true)
    private Instant reviewedAt;

    @Column(nullable = true)
    private String reviewedByEmail;

    @Column(nullable = true, length = 1000)
    private String reviewNote;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public PaymentMethod getMethod() {
        return method;
    }

    public void setMethod(PaymentMethod method) {
        this.method = method;
    }

    public TransactionReferenceType getReferenceType() {
        return referenceType;
    }

    public void setReferenceType(
        TransactionReferenceType referenceType
    ) {
        this.referenceType = referenceType;
    }

    public String getReferenceValue() {
        return referenceValue;
    }

    public void setReferenceValue(String referenceValue) {
        this.referenceValue = referenceValue;
    }

    public String getScreenshotStorageKey() {
        return screenshotStorageKey;
    }

    public void setScreenshotStorageKey(
        String screenshotStorageKey
    ) {
        this.screenshotStorageKey = screenshotStorageKey;
    }

    public String getScreenshotContentType() {
        return screenshotContentType;
    }

    public void setScreenshotContentType(
        String screenshotContentType
    ) {
        this.screenshotContentType = screenshotContentType;
    }

    public PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(PaymentStatus status) {
        this.status = status;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(Instant reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public String getReviewedByEmail() {
        return reviewedByEmail;
    }

    public void setReviewedByEmail(String reviewedByEmail) {
        this.reviewedByEmail = reviewedByEmail;
    }

    public String getReviewNote() {
        return reviewNote;
    }

    public void setReviewNote(String reviewNote) {
        this.reviewNote = reviewNote;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public enum PaymentMethod {
        UPI,
        BANK_TRANSFER,
        CARD,
        OTHER
    }

    public enum TransactionReferenceType {
        TRANSACTION_ID,
        UTR
    }

    public enum PaymentStatus {
        PENDING,
        UNDER_REVIEW,
        VERIFIED,
        REJECTED
    }
}
