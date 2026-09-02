package in.engineeringos.api.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository
    extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByUserId(UUID userId);

    List<Payment> findAllByOrderBySubmittedAtDesc();

    List<Payment> findAllByStatusOrderBySubmittedAtDesc(
        Payment.PaymentStatus status
    );

    void deleteByUserId(UUID userId);
}