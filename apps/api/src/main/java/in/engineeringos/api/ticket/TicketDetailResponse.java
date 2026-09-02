package in.engineeringos.api.ticket;

import java.time.Instant;
import java.util.List;

public record TicketDetailResponse(
    String id,
    String subject,
    String status,
    String studentName,
    String studentEmail,
    Instant createdAt,
    Instant updatedAt,
    List<TicketMessageResponse> messages
) {}