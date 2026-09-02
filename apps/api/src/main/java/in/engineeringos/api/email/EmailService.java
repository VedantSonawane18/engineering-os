package in.engineeringos.api.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    private static final String SUPPORT_EMAIL =
        "engineeroscse@gmail.com";

    private static final String SUPPORT_PHONE =
        "+91 80104 03545";

    public EmailService(
        JavaMailSender mailSender,
        @Value("${spring.mail.username:}")
        String fromAddress
    ) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
    }

    public void sendVerificationCode(
        String recipient,
        String code
    ) {

        send(
            recipient,
            "Engineering OS - Verify Your Account",
            """
            Hello,

            Welcome to Engineering OS.

            Your email verification code is:

            %s

            This code will expire in 10 minutes.

            If you did not create an Engineering OS
            account, you can safely ignore this email.

            Regards,
            Engineering OS
            """.formatted(code)
        );
    }

    public void sendApplicationApproved(
        String recipient,
        String studentName
    ) {

        String name = safeName(studentName);

        send(
            recipient,
            "Engineering OS - Application Approved",
            """
            Hello %s,

            Your Engineering OS application has been
            approved by the administrator.

            Your payment and registration have been
            successfully verified.

            Your webinar meeting link and access details
            will be shared shortly.

            Please keep an eye on your registered email
            address for further communication.

            If you have any questions or need assistance,
            you can contact the Engineering OS administrator:

            Email:
            %s

            Phone:
            %s

            Regards,
            Engineering OS
            """.formatted(
                name,
                SUPPORT_EMAIL,
                SUPPORT_PHONE
            )
        );
    }

    public void sendApplicationUnderReview(
        String recipient,
        String studentName
    ) {

        String name = safeName(studentName);

        send(
            recipient,
            "Engineering OS - Application Under Review",
            """
            Hello %s,

            Your Engineering OS application is currently
            under review by the administrator.

            We are reviewing your registration and payment
            details. You will receive another notification
            once the review has been completed.

            While your application is under review, you may
            use the Engineering OS website to post queries
            and communicate privately with the administrator.

            Please allow some time for a response.

            If you need immediate assistance, contact:

            Email:
            %s

            Phone:
            %s

            Regards,
            Engineering OS
            """.formatted(
                name,
                SUPPORT_EMAIL,
                SUPPORT_PHONE
            )
        );
    }

    public void sendApplicationRejected(
        String recipient,
        String studentName
    ) {

        String name = safeName(studentName);

        send(
            recipient,
            "Engineering OS - Application Update",
            """
            Hello %s,

            We regret to inform you that your Engineering OS
            application has been rejected.

            Please review the information submitted through
            your account. If you believe this decision was
            made in error or you require clarification,
            please contact the Engineering OS administrator.

            You may also use the Engineering OS website to
            submit a private support query.

            Contact:

            Email:
            %s

            Phone:
            %s

            Regards,
            Engineering OS
            """.formatted(
                name,
                SUPPORT_EMAIL,
                SUPPORT_PHONE
            )
        );
    }

    private void send(
        String recipient,
        String subject,
        String body
    ) {

        if (
            fromAddress == null ||
            fromAddress.isBlank()
        ) {
            throw new IllegalStateException(
                "Email sender address is not configured."
            );
        }

        SimpleMailMessage message =
            new SimpleMailMessage();

        message.setFrom(fromAddress);
        message.setTo(recipient);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    private String safeName(
        String studentName
    ) {

        if (
            studentName == null ||
            studentName.isBlank()
        ) {
            return "Student";
        }

        return studentName.trim();
    }
}