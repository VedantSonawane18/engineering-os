package in.engineeringos.api.config;

import in.engineeringos.api.user.User;
import in.engineeringos.api.user.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrap {

    @Bean
    CommandLineRunner createDevelopmentAdmin(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        @Value("${engineering-os.admin.email:admin@engineeringos.in}")
        String adminEmail,
        @Value("${engineering-os.admin.password:ChangeMe_Admin_123!}")
        String adminPassword
    ) {
        return args -> {

            String email = adminEmail
                .trim()
                .toLowerCase();

            if (userRepository.existsByEmail(email)) {
                return;
            }

            User admin = new User();

            admin.setFullName("Engineering OS Admin");
            admin.setEmail(email);
            admin.setPasswordHash(
                passwordEncoder.encode(adminPassword)
            );

            admin.setRole(User.Role.ADMIN);
            admin.setApprovalStatus(User.ApprovalStatus.APPROVED);

            userRepository.save(admin);

            System.out.println(
                "Development admin account created: " + email
            );
        };
    }
}