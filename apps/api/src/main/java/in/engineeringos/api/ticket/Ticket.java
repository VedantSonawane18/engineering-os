package in.engineeringos.api.ticket;

import in.engineeringos.api.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "tickets",
    indexes = {
        @Index(
            name = "idx_tickets_student",
            columnList = "student_id"
        ),
        @Index(
            name = "idx_tickets_status",
            columnList = "status"
        ),
        @Index(
            name = "idx_tickets_updated_at",
            columnList = "updated_at"
        )
    }
)
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "student_id",
        nullable = false
    )
    private User student;

    @Column(
        nullable = false,
        length = 200
    )
    private String subject;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.OPEN;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public enum TicketStatus {
        OPEN,
        IN_PROGRESS,
        WAITING_FOR_STUDENT,
        RESOLVED,
        CLOSED
    }
}