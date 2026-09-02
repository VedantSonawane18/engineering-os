package in.engineeringos.api.auth;

import in.engineeringos.api.user.User;
import in.engineeringos.api.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User register(RegisterRequest request) {

        String email =
            normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                "An account with this email already exists."
            );
        }

        User user = new User();

        user.setFullName(
            request.fullName().trim()
        );

        user.setEmail(email);

        user.setPhoneNumber(
            normalizePhone(
                request.phoneNumber()
            )
        );

        user.setPasswordHash(
            passwordEncoder.encode(
                request.password()
            )
        );

        /*
         * Email and phone OTP verification have been
         * removed from Engineering OS.
         *
         * Account verification is now handled through
         * the administrator approval workflow.
         */
        user.setEmailVerified(true);
        user.setPhoneVerified(false);

        /*
         * New student accounts remain PENDING until
         * manually reviewed and approved by an admin.
         */
        user.setApprovalStatus(
            User.ApprovalStatus.PENDING
        );

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User authenticate(
        LoginRequest request
    ) {

        String email =
            normalizeEmail(request.email());

        User user =
            userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                    new IllegalArgumentException(
                        "Invalid email or password."
                    )
                );

        if (
            !passwordEncoder.matches(
                request.password(),
                user.getPasswordHash()
            )
        ) {
            throw new IllegalArgumentException(
                "Invalid email or password."
            );
        }

        return user;
    }

    @Transactional(readOnly = true)
    public User findByEmail(
        String email
    ) {

        return userRepository
            .findByEmail(
                normalizeEmail(email)
            )
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User account not found."
                )
            );
    }

    private String normalizeEmail(
        String email
    ) {
        return email
            .trim()
            .toLowerCase();
    }

    private String normalizePhone(
        String phone
    ) {
        return phone
            .trim()
            .replaceAll(
                "[\\s()-]",
                ""
            );
    }
}