package in.engineeringos.api.dashboard;

import in.engineeringos.api.ticket.Ticket;
import in.engineeringos.api.ticket.TicketRepository;
import in.engineeringos.api.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DashboardService {

    private static final List<Ticket.TicketStatus> OPEN_TICKET_STATUSES =
        List.of(
            Ticket.TicketStatus.OPEN,
            Ticket.TicketStatus.IN_PROGRESS,
            Ticket.TicketStatus.WAITING_FOR_STUDENT
        );

    private final TicketRepository ticketRepository;

    public DashboardService(
        TicketRepository ticketRepository
    ) {
        this.ticketRepository = ticketRepository;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(User user) {

        long openTickets =
            user.getRole() == User.Role.STUDENT
                ? ticketRepository.countByStudentAndStatusIn(
                    user,
                    OPEN_TICKET_STATUSES
                )
                : ticketRepository.countByStatusIn(
                    OPEN_TICKET_STATUSES
                );

        return DashboardResponse.from(
            user,
            openTickets
        );
    }
}