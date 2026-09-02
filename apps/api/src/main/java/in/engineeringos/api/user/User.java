package in.engineeringos.api.user;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_users_email",
            columnNames = "email"
        )
    }
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = true)
    private Boolean emailVerified = false;

    @Column(nullable = true)
    private Boolean phoneVerified = false;

    @Column(nullable = true)
    private String emailVerificationCodeHash;

    @Column(nullable = true)
    private Instant emailVerificationExpiresAt;

    @Column(nullable = true)
    private String phoneVerificationCodeHash;

    @Column(nullable = true)
    private Instant phoneVerificationExpiresAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.STUDENT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus approvalStatus =
        ApprovalStatus.PENDING;

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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email.toLowerCase().trim();
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber == null
            ? null
            : phoneNumber.trim();
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Boolean getEmailVerified() {
        return Boolean.TRUE.equals(emailVerified);
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Boolean getPhoneVerified() {
        return Boolean.TRUE.equals(phoneVerified);
    }

    public void setPhoneVerified(Boolean phoneVerified) {
        this.phoneVerified = phoneVerified;
    }

    public String getEmailVerificationCodeHash() {
        return emailVerificationCodeHash;
    }

    public void setEmailVerificationCodeHash(
        String emailVerificationCodeHash
    ) {
        this.emailVerificationCodeHash =
            emailVerificationCodeHash;
    }

    public Instant getEmailVerificationExpiresAt() {
        return emailVerificationExpiresAt;
    }

    public void setEmailVerificationExpiresAt(
        Instant emailVerificationExpiresAt
    ) {
        this.emailVerificationExpiresAt =
            emailVerificationExpiresAt;
    }

    public String getPhoneVerificationCodeHash() {
        return phoneVerificationCodeHash;
    }

    public void setPhoneVerificationCodeHash(
        String phoneVerificationCodeHash
    ) {
        this.phoneVerificationCodeHash =
            phoneVerificationCodeHash;
    }

    public Instant getPhoneVerificationExpiresAt() {
        return phoneVerificationExpiresAt;
    }

    public void setPhoneVerificationExpiresAt(
        Instant phoneVerificationExpiresAt
    ) {
        this.phoneVerificationExpiresAt =
            phoneVerificationExpiresAt;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(
        ApprovalStatus approvalStatus
    ) {
        this.approvalStatus = approvalStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public enum Role {
        STUDENT,
        ADMIN
    }

    public enum ApprovalStatus {
        PENDING,
        UNDER_REVIEW,
        APPROVED,
        REJECTED
    }
}