package in.engineeringos.api.ticket;

public class TicketAccessDeniedException
    extends RuntimeException {

    public TicketAccessDeniedException() {
        super();
    }

    public TicketAccessDeniedException(String message) {
        super(message);
    }

    public TicketAccessDeniedException(
        String message,
        Throwable cause
    ) {
        super(message, cause);
    }
}