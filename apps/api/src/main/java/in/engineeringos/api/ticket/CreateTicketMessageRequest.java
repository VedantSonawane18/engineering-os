package in.engineeringos.api.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTicketMessageRequest(

    @NotBlank
    @Size(
        min = 1,
        max = 5000
    )
    String message

) {}