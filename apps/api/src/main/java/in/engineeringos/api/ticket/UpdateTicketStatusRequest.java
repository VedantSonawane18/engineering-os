package in.engineeringos.api.ticket;

import jakarta.validation.constraints.NotNull;

public record UpdateTicketStatusRequest(

    @NotNull
    Ticket.TicketStatus status

) {}