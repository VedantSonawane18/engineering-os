package in.engineeringos.api.admin;

import in.engineeringos.api.ticket.CreateTicketMessageRequest;
import in.engineeringos.api.ticket.Ticket;
import in.engineeringos.api.ticket.TicketDetailResponse;
import in.engineeringos.api.ticket.TicketResponse;
import in.engineeringos.api.ticket.TicketService;
import in.engineeringos.api.ticket.UpdateTicketStatusRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/tickets")
public class AdminTicketController {

    private final TicketService ticketService;

    public AdminTicketController(
        TicketService ticketService
    ) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<TicketResponse>> getAllTickets(
        @RequestParam(
            value = "status",
            required = false
        )
        Ticket.TicketStatus status
    ) {

        if (status == null) {
            return ResponseEntity.ok(
                ticketService.getAllTickets()
            );
        }

        return ResponseEntity.ok(
            ticketService.getTicketsByStatus(status)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicket(
        @PathVariable UUID id
    ) {

        try {

            return ResponseEntity.ok(
                ticketService.getAdminTicket(id)
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<?> addMessage(
        @PathVariable UUID id,
        @Valid @RequestBody CreateTicketMessageRequest request,
        Authentication authentication
    ) {

        try {

            TicketDetailResponse response =
                ticketService.addAdminMessage(
                    authentication.getName(),
                    id,
                    request
                );

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
        @PathVariable UUID id,
        @Valid @RequestBody UpdateTicketStatusRequest request,
        Authentication authentication
    ) {

        try {

            return ResponseEntity.ok(
                ticketService.updateTicketStatus(
                    authentication.getName(),
                    id,
                    request
                )
            );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    public record ErrorResponse(
        String message
    ) {}
}