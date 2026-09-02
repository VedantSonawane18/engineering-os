package in.engineeringos.api.auth;

import in.engineeringos.api.user.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @Valid @RequestBody RegisterRequest request,
        HttpServletRequest httpRequest
    ) {

        try {

            User user = authService.register(request);

            authenticateSession(user, httpRequest);

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(AuthResponse.from(user));

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
        @Valid @RequestBody LoginRequest request,
        HttpServletRequest httpRequest
    ) {

        try {

            User user = authService.authenticate(request);

            authenticateSession(user, httpRequest);

            return ResponseEntity.ok(
                AuthResponse.from(user)
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(
        HttpServletRequest httpRequest
    ) {

        HttpSession session =
            httpRequest.getSession(false);

        if (session == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                    new ErrorResponse(
                        "Not authenticated."
                    )
                );
        }

        Object userEmail =
            session.getAttribute("USER_EMAIL");

        if (!(userEmail instanceof String email)) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                    new ErrorResponse(
                        "Not authenticated."
                    )
                );
        }

        try {

            User user =
                authService.findByEmail(email);

            return ResponseEntity.ok(
                AuthResponse.from(user)
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                    new ErrorResponse(
                        "Not authenticated."
                    )
                );
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(
        @Valid @RequestBody VerifyCodeRequest request
    ) {

        try {

            User user = authService.verifyEmail(
                request.email(),
                request.code()
            );

            return ResponseEntity.ok(
                AuthResponse.from(user)
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @PostMapping("/verify-phone")
    public ResponseEntity<?> verifyPhone(
        @Valid @RequestBody VerifyCodeRequest request
    ) {

        try {

            User user = authService.verifyPhone(
                request.email(),
                request.code()
            );

            return ResponseEntity.ok(
                AuthResponse.from(user)
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(
        @Valid @RequestBody ResendVerificationRequest request
    ) {

        try {

            authService.resendVerificationCodes(
                request.email()
            );

            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
        HttpServletRequest httpRequest
    ) {

        HttpSession session =
            httpRequest.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        return ResponseEntity.noContent().build();
    }

    private void authenticateSession(
        User user,
        HttpServletRequest httpRequest
    ) {

        UsernamePasswordAuthenticationToken authentication =
            UsernamePasswordAuthenticationToken.authenticated(
                user.getEmail(),
                null,
                java.util.List.of(
                    new org.springframework.security.core.authority.SimpleGrantedAuthority(
                        "ROLE_" + user.getRole().name()
                    )
                )
            );

        SecurityContext context =
            SecurityContextHolder.createEmptyContext();

        context.setAuthentication(authentication);

        SecurityContextHolder.setContext(context);

        HttpSession session =
            httpRequest.getSession(true);

        session.setAttribute(
            "USER_EMAIL",
            user.getEmail()
        );

        session.setAttribute(
            HttpSessionSecurityContextRepository
                .SPRING_SECURITY_CONTEXT_KEY,
            context
        );
    }

    public record AuthResponse(
        String id,
        String fullName,
        String email,
        String phoneNumber,
        String role,
        String approvalStatus,
        boolean emailVerified,
        boolean phoneVerified
    ) {

        static AuthResponse from(User user) {

            return new AuthResponse(
                user.getId().toString(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole().name(),
                user.getApprovalStatus().name(),
                user.getEmailVerified(),
                user.getPhoneVerified()
            );
        }
    }

    public record VerifyCodeRequest(

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Pattern(
            regexp = "^\\d{6}$",
            message = "Verification code must contain 6 digits."
        )
        String code

    ) {}

    public record ResendVerificationRequest(

        @NotBlank
        @Email
        String email

    ) {}

    public record ErrorResponse(
        String message
    ) {}
}