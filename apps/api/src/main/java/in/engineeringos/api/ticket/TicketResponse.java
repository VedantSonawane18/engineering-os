package in.engineeringos.api.ticket;

import java.time.Instant;

public record TicketResponse(
    String id,
    String subject,
    String status,
    String studentName,
    String studentEmail,
    Instant createdAt,
    Instant updatedAt
) {

    public static TicketResponse from(Ticket ticket) {
        return new TicketResponse(
            ticket.getId().toString(),
            ticket.getSubject(),
            ticket.getStatus().name(),
            ticket.getStudent().getFullName(),
            ticket.getStudent().getEmail(),
            ticket.getCreatedAt(),
            ticket.getUpdatedAt()
        );
    }
}