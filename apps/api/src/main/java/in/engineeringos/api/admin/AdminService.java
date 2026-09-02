package in.engineeringos.api.admin;

import in.engineeringos.api.payment.Payment;
import in.engineeringos.api.payment.PaymentRepository;
import in.engineeringos.api.profile.StudentProfileRepository;
import in.engineeringos.api.storage.FileStorageService;
import in.engineeringos.api.ticket.Ticket;
import in.engineeringos.api.ticket.TicketMessageRepository;
import in.engineeringos.api.ticket.TicketRepository;
import in.engineeringos.api.user.User;
import in.engineeringos.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;
    private final TicketMessageRepository ticketMessageRepository;
    private final FileStorageService fileStorageService;

    public AdminService(
        UserRepository userRepository,
        StudentProfileRepository studentProfileRepository,
        PaymentRepository paymentRepository,
        TicketRepository ticketRepository,
        TicketMessageRepository ticketMessageRepository,
        FileStorageService fileStorageService
    ) {
        this.userRepository = userRepository;
        this.studentProfileRepository =
            studentProfileRepository;
        this.paymentRepository = paymentRepository;
        this.ticketRepository = ticketRepository;
        this.ticketMessageRepository =
            ticketMessageRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<AdminStudentResponse> getStudents() {
        return userRepository.findAll()
            .stream()
            .filter(
                user -> user.getRole() == User.Role.STUDENT
            )
            .map(AdminStudentResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public AdminStudentResponse getStudent(UUID id) {

        User user = getStudentEntity(id);

        return AdminStudentResponse.from(user);
    }

    @Transactional
    public AdminStudentResponse markUnderReview(UUID id) {

        User user = getStudentEntity(id);

        user.setApprovalStatus(
            User.ApprovalStatus.UNDER_REVIEW
        );

        return AdminStudentResponse.from(
            userRepository.save(user)
        );
    }

    @Transactional
    public AdminStudentResponse approve(UUID id) {

        User user = getStudentEntity(id);

        user.setApprovalStatus(
            User.ApprovalStatus.APPROVED
        );

        return AdminStudentResponse.from(
            userRepository.save(user)
        );
    }

    @Transactional
    public AdminStudentResponse reject(UUID id) {

        User user = getStudentEntity(id);

        user.setApprovalStatus(
            User.ApprovalStatus.REJECTED
        );

        return AdminStudentResponse.from(
            userRepository.save(user)
        );
    }

    @Transactional
    public void deleteStudent(UUID id) {

        User user = getStudentEntity(id);

        /*
         * ==========================================
         * DELETE PAYMENT + STORED SCREENSHOT
         * ==========================================
         */

        paymentRepository
            .findByUserId(user.getId())
            .ifPresent(payment -> {

                String screenshotKey =
                    payment.getScreenshotStorageKey();

                paymentRepository.delete(payment);

                if (
                    screenshotKey != null &&
                    !screenshotKey.isBlank()
                ) {
                    fileStorageService.delete(
                        screenshotKey
                    );
                }
            });

        /*
         * ==========================================
         * DELETE STUDENT PROFILE
         * ==========================================
         */

        studentProfileRepository
            .findByUserId(user.getId())
            .ifPresent(
                studentProfileRepository::delete
            );

        /*
         * ==========================================
         * DELETE TICKETS + MESSAGES
         * ==========================================
         */

        List<Ticket> tickets =
            ticketRepository.findByStudent(user);

        for (Ticket ticket : tickets) {
            ticketMessageRepository.deleteByTicket(
                ticket
            );
        }

        ticketRepository.deleteAll(tickets);

        /*
         * ==========================================
         * DELETE USER
         * ==========================================
         */

        userRepository.delete(user);
    }

    private User getStudentEntity(UUID id) {

        User user = userRepository.findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Student not found."
                )
            );

        if (user.getRole() != User.Role.STUDENT) {
            throw new IllegalArgumentException(
                "The requested account is not a student."
            );
        }

        return user;
    }
}