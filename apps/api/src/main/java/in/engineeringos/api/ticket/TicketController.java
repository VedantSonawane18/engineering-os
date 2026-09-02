package in.engineeringos.api.ticket;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<?> createTicket(
        @Valid @RequestBody CreateTicketRequest request,
        Authentication authentication
    ) {

        try {

            TicketDetailResponse response =
                ticketService.createTicket(
                    authentication.getName(),
                    request
                );

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

        } catch (TicketAccessDeniedException exception) {

            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyTickets(
        Authentication authentication
    ) {

        try {

            List<TicketResponse> tickets =
                ticketService.getStudentTickets(
                    authentication.getName()
                );

            return ResponseEntity.ok(tickets);

        } catch (TicketAccessDeniedException exception) {

            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );

        } catch (IllegalArgumentException exception) {

            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
                    )
                );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMyTicket(
        @PathVariable UUID id,
        Authentication authentication
    ) {

        try {

            TicketDetailResponse response =
                ticketService.getStudentTicket(
                    authentication.getName(),
                    id
                );

            return ResponseEntity.ok(response);

        } catch (TicketAccessDeniedException exception) {

            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
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

    @PostMapping("/{id}/messages")
    public ResponseEntity<?> addMessage(
        @PathVariable UUID id,
        @Valid @RequestBody CreateTicketMessageRequest request,
        Authentication authentication
    ) {

        try {

            TicketDetailResponse response =
                ticketService.addStudentMessage(
                    authentication.getName(),
                    id,
                    request
                );

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

        } catch (TicketAccessDeniedException exception) {

            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(
                    new ErrorResponse(
                        exception.getMessage()
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