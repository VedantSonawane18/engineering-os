package in.engineeringos.api.auth;

import in.engineeringos.api.email.EmailService;
import in.engineeringos.api.user.User;
import in.engineeringos.api.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthService {

    private static final int OTP_EXPIRY_MINUTES = 10;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom secureRandom =
        new SecureRandom();

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
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

        user.setEmailVerified(false);

        /*
         * Phone number is collected as a contact detail,
         * but phone verification is not required.
         *
         * We deliberately do not generate or send
         * a phone OTP anymore.
         */
        user.setPhoneVerified(false);

        user = userRepository.save(user);

        generateEmailVerificationCode(user);

        return user;
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

    @Transactional
    public User verifyEmail(
        String email,
        String code
    ) {

        User user = findByEmail(email);

        if (user.getEmailVerified()) {
            return user;
        }

        if (
            user.getEmailVerificationExpiresAt()
                == null ||
            Instant.now().isAfter(
                user.getEmailVerificationExpiresAt()
            )
        ) {
            throw new IllegalArgumentException(
                "This email verification code has expired."
            );
        }

        if (
            user.getEmailVerificationCodeHash()
                == null ||
            !passwordEncoder.matches(
                code,
                user.getEmailVerificationCodeHash()
            )
        ) {
            throw new IllegalArgumentException(
                "Invalid email verification code."
            );
        }

        user.setEmailVerified(true);

        user.setEmailVerificationCodeHash(
            null
        );

        user.setEmailVerificationExpiresAt(
            null
        );

        return userRepository.save(user);
    }

    /*
     * Retained for backwards compatibility with the
     * existing API surface.
     *
     * Phone verification is no longer part of the
     * registration requirement, so this method simply
     * returns the current account.
     */
    @Transactional(readOnly = true)
    public User verifyPhone(
        String email,
        String code
    ) {

        return findByEmail(email);
    }

    @Transactional
    public void resendVerificationCodes(
        String email
    ) {

        User user = findByEmail(email);

        if (user.getEmailVerified()) {
            throw new IllegalArgumentException(
                "This email address is already verified."
            );
        }

        generateEmailVerificationCode(user);

        userRepository.save(user);
    }

    private void generateEmailVerificationCode(
        User user
    ) {

        String emailCode =
            generateOtp();

        Instant expiresAt =
            Instant.now()
                .plus(
                    OTP_EXPIRY_MINUTES,
                    ChronoUnit.MINUTES
                );

        user.setEmailVerificationCodeHash(
            passwordEncoder.encode(
                emailCode
            )
        );

        user.setEmailVerificationExpiresAt(
            expiresAt
        );

        /*
         * Real email delivery through Gmail SMTP.
         */
        emailService.sendVerificationCode(
            user.getEmail(),
            emailCode
        );
    }

    private String generateOtp() {

        int minimum = 100000;
        int maximum = 1000000;

        return String.valueOf(
            secureRandom.nextInt(
                maximum - minimum
            ) + minimum
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