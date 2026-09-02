package in.engineeringos.api.ticket;

import in.engineeringos.api.user.User;
import in.engineeringos.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private static final Collection<Ticket.TicketStatus> OPEN_STATUSES =
        List.of(
            Ticket.TicketStatus.OPEN,
            Ticket.TicketStatus.IN_PROGRESS,
            Ticket.TicketStatus.WAITING_FOR_STUDENT
        );

    private final TicketRepository ticketRepository;
    private final TicketMessageRepository ticketMessageRepository;
    private final UserRepository userRepository;

    public TicketService(
        TicketRepository ticketRepository,
        TicketMessageRepository ticketMessageRepository,
        UserRepository userRepository
    ) {
        this.ticketRepository = ticketRepository;
        this.ticketMessageRepository = ticketMessageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TicketDetailResponse createTicket(
        String studentEmail,
        CreateTicketRequest request
    ) {

        User student = findUser(studentEmail);

        requireStudent(student);

        String subject = request.subject().trim();
        String message = request.message().trim();

        validateSubject(subject);
        validateMessage(message);

        Ticket ticket = new Ticket();

        ticket.setStudent(student);
        ticket.setSubject(subject);
        ticket.setStatus(Ticket.TicketStatus.OPEN);

        Ticket savedTicket =
            ticketRepository.save(ticket);

        TicketMessage firstMessage =
            new TicketMessage();

        firstMessage.setTicket(savedTicket);
        firstMessage.setSender(student);
        firstMessage.setMessage(message);

        ticketMessageRepository.save(firstMessage);

        return toDetailResponse(savedTicket);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getStudentTickets(
        String studentEmail
    ) {

        User student = findUser(studentEmail);

        requireStudent(student);

        return ticketRepository
            .findByStudentOrderByUpdatedAtDesc(student)
            .stream()
            .map(TicketResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public TicketDetailResponse getStudentTicket(
        String studentEmail,
        UUID ticketId
    ) {

        User student = findUser(studentEmail);

        requireStudent(student);

        Ticket ticket = findTicket(ticketId);

        requireOwner(ticket, student);

        return toDetailResponse(ticket);
    }

    @Transactional
    public TicketDetailResponse addStudentMessage(
        String studentEmail,
        UUID ticketId,
        CreateTicketMessageRequest request
    ) {

        User student = findUser(studentEmail);

        requireStudent(student);

        Ticket ticket = findTicket(ticketId);

        requireOwner(ticket, student);

        String message = request.message().trim();

        validateMessage(message);

        TicketMessage ticketMessage =
            new TicketMessage();

        ticketMessage.setTicket(ticket);
        ticketMessage.setSender(student);
        ticketMessage.setMessage(message);

        ticketMessageRepository.save(ticketMessage);

        if (
            ticket.getStatus()
                == Ticket.TicketStatus.WAITING_FOR_STUDENT
        ) {
            ticket.setStatus(
                Ticket.TicketStatus.OPEN
            );
        }

        Ticket savedTicket =
            ticketRepository.save(ticket);

        return toDetailResponse(savedTicket);
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {

        return ticketRepository
            .findAllByOrderByUpdatedAtDesc()
            .stream()
            .map(TicketResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsByStatus(
        Ticket.TicketStatus status
    ) {

        return ticketRepository
            .findByStatusOrderByUpdatedAtDesc(status)
            .stream()
            .map(TicketResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public TicketDetailResponse getAdminTicket(
        UUID ticketId
    ) {

        Ticket ticket = findTicket(ticketId);

        return toDetailResponse(ticket);
    }

    @Transactional
    public TicketDetailResponse addAdminMessage(
        String adminEmail,
        UUID ticketId,
        CreateTicketMessageRequest request
    ) {

        User admin = findUser(adminEmail);

        requireAdmin(admin);

        Ticket ticket = findTicket(ticketId);

        String message = request.message().trim();

        validateMessage(message);

        TicketMessage ticketMessage =
            new TicketMessage();

        ticketMessage.setTicket(ticket);
        ticketMessage.setSender(admin);
        ticketMessage.setMessage(message);

        ticketMessageRepository.save(ticketMessage);

        /*
         * An administrator reply means the next action
         * belongs to the student unless the administrator
         * explicitly changes the status afterwards.
         */
        ticket.setStatus(
            Ticket.TicketStatus.WAITING_FOR_STUDENT
        );

        Ticket savedTicket =
            ticketRepository.save(ticket);

        return toDetailResponse(savedTicket);
    }

    @Transactional
    public TicketDetailResponse updateTicketStatus(
        String adminEmail,
        UUID ticketId,
        UpdateTicketStatusRequest request
    ) {

        User admin = findUser(adminEmail);

        requireAdmin(admin);

        Ticket ticket = findTicket(ticketId);

        if (request.status() == null) {
            throw new IllegalArgumentException(
                "Ticket status is required."
            );
        }

        ticket.setStatus(request.status());

        Ticket savedTicket =
            ticketRepository.save(ticket);

        return toDetailResponse(savedTicket);
    }

    @Transactional(readOnly = true)
    public long countOpenForStudent(
        String studentEmail
    ) {

        User student = findUser(studentEmail);

        requireStudent(student);

        return ticketRepository.countByStudentAndStatusIn(
            student,
            OPEN_STATUSES
        );
    }

    @Transactional(readOnly = true)
    public long countOpenForAdmin() {

        return ticketRepository.countByStatusIn(
            OPEN_STATUSES
        );
    }

    /*
     * Convenience aliases.
     *
     * These keep the service easy to integrate with
     * controllers regardless of whether they use
     * "create/get/send" or "student/admin" terminology.
     */

    @Transactional(readOnly = true)
    public List<TicketResponse> getMyTickets(
        String studentEmail
    ) {
        return getStudentTickets(studentEmail);
    }

    @Transactional(readOnly = true)
    public TicketDetailResponse getMyTicket(
        String studentEmail,
        UUID ticketId
    ) {
        return getStudentTicket(
            studentEmail,
            ticketId
        );
    }

    @Transactional
    public TicketDetailResponse sendStudentMessage(
        String studentEmail,
        UUID ticketId,
        CreateTicketMessageRequest request
    ) {
        return addStudentMessage(
            studentEmail,
            ticketId,
            request
        );
    }

    @Transactional
    public TicketDetailResponse sendAdminMessage(
        String adminEmail,
        UUID ticketId,
        CreateTicketMessageRequest request
    ) {
        return addAdminMessage(
            adminEmail,
            ticketId,
            request
        );
    }

    @Transactional
    public TicketDetailResponse updateStatus(
        String adminEmail,
        UUID ticketId,
        UpdateTicketStatusRequest request
    ) {
        return updateTicketStatus(
            adminEmail,
            ticketId,
            request
        );
    }

    private User findUser(String email) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                "Authenticated user could not be determined."
            );
        }

        return userRepository
            .findByEmail(email.trim().toLowerCase())
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User account not found."
                )
            );
    }

    private Ticket findTicket(UUID ticketId) {

        if (ticketId == null) {
            throw new IllegalArgumentException(
                "Ticket ID is required."
            );
        }

        return ticketRepository
            .findById(ticketId)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Ticket not found."
                )
            );
    }

    private void requireStudent(User user) {

        if (user.getRole() != User.Role.STUDENT) {
            throw new TicketAccessDeniedException(
                "Student ticket access is restricted to student accounts."
            );
        }
    }

    private void requireAdmin(User user) {

        if (user.getRole() != User.Role.ADMIN) {
            throw new TicketAccessDeniedException(
                "Administrator ticket access is restricted to admin accounts."
            );
        }
    }

    private void requireOwner(
        Ticket ticket,
        User authenticatedStudent
    ) {

        if (
            !ticket.getStudent()
                .getId()
                .equals(authenticatedStudent.getId())
        ) {
            throw new TicketAccessDeniedException(
                "You do not have access to this ticket."
            );
        }
    }

    private TicketDetailResponse toDetailResponse(
        Ticket ticket
    ) {

        List<TicketMessageResponse> messages =
            ticketMessageRepository
                .findByTicketOrderByCreatedAtAsc(ticket)
                .stream()
                .map(this::toMessageResponse)
                .toList();

        return new TicketDetailResponse(
            ticket.getId().toString(),
            ticket.getSubject(),
            ticket.getStatus().name(),
            ticket.getStudent().getFullName(),
            ticket.getStudent().getEmail(),
            ticket.getCreatedAt(),
            ticket.getUpdatedAt(),
            messages
        );
    }

    private TicketMessageResponse toMessageResponse(
        TicketMessage message
    ) {

        User sender = message.getSender();

        return new TicketMessageResponse(
            message.getId().toString(),
            sender.getId().toString(),
            sender.getFullName(),
            sender.getRole().name(),
            message.getMessage(),
            message.getCreatedAt()
        );
    }

    private void validateSubject(String subject) {

        if (subject.length() < 3) {
            throw new IllegalArgumentException(
                "Subject must contain at least 3 characters."
            );
        }

        if (subject.length() > 200) {
            throw new IllegalArgumentException(
                "Subject must not exceed 200 characters."
            );
        }
    }

    private void validateMessage(String message) {

        if (message.isBlank()) {
            throw new IllegalArgumentException(
                "Message cannot be empty."
            );
        }

        if (message.length() > 5000) {
            throw new IllegalArgumentException(
                "Message must not exceed 5000 characters."
            );
        }
    }
}