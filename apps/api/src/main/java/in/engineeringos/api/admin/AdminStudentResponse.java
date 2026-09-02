package in.engineeringos.api.admin;

import in.engineeringos.api.user.User;

import java.time.Instant;

public record AdminStudentResponse(
    String id,
    String fullName,
    String email,
    String approvalStatus,
    Instant createdAt,
    Instant updatedAt
) {

    public static AdminStudentResponse from(User user) {

        return new AdminStudentResponse(
            user.getId().toString(),
            user.getFullName(),
            user.getEmail(),
            user.getApprovalStatus().name(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}