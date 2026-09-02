package in.engineeringos.api.ticket;

import in.engineeringos.api.user.User;
import in.engineeringos.api.ticket.Ticket.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface TicketRepository
    extends JpaRepository<Ticket, UUID> {

    List<Ticket> findByStudentOrderByUpdatedAtDesc(
        User student
    );

    List<Ticket> findAllByOrderByUpdatedAtDesc();

    List<Ticket> findByStatusOrderByUpdatedAtDesc(
        TicketStatus status
    );

    List<Ticket> findByStudent(
        User student
    );

    long countByStudentAndStatusIn(
        User student,
        Collection<TicketStatus> statuses
    );

    long countByStatusIn(
        Collection<TicketStatus> statuses
    );
}