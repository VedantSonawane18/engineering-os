package in.engineeringos.api.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

    @NotBlank
    @Size(min = 2, max = 100)
    String fullName,

    @NotBlank
    @Email
    String email,

    @NotBlank
    @Pattern(
        regexp = "^\\+?[1-9]\\d{9,14}$",
        message = "Enter a valid phone number."
    )
    String phoneNumber,

    @NotBlank
    @Size(min = 8, max = 72)
    String password

) {}