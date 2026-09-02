package in.engineeringos.api.profile;

public record ProfileResponse(
    String id,
    String fullName,
    String email,
    String college,
    String branch,
    Integer graduationYear,
    Integer semester
) {}