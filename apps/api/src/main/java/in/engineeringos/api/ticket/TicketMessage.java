package in.engineeringos.api.ticket;

import in.engineeringos.api.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "ticket_messages",
    indexes = {
        @Index(
            name = "idx_ticket_messages_ticket",
            columnList = "ticket_id"
        ),
        @Index(
            name = "idx_ticket_messages_created_at",
            columnList = "created_at"
        )
    }
)
public class TicketMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "ticket_id",
        nullable = false
    )
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "sender_id",
        nullable = false
    )
    private User sender;

    @Column(
        nullable = false,
        length = 5000
    )
    private String message;

    @Column(nullable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setTicket(Ticket ticket) {
        this.ticket = ticket;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}