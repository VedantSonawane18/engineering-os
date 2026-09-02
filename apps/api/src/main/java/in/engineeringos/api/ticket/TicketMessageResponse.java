package in.engineeringos.api.ticket;

import java.time.Instant;

public record TicketMessageResponse(
    String id,
    String senderId,
    String senderName,
    String senderRole,
    String message,
    Instant createdAt
) {}