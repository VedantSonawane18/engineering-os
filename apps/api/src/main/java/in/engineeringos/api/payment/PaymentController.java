package in.engineeringos.api.payment;

import in.engineeringos.api.storage.FileStorageException;
import in.engineeringos.api.user.User;
import in.engineeringos.api.user.UserRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    public PaymentController(
        PaymentService paymentService,
        UserRepository userRepository
    ) {
        this.paymentService = paymentService;
        this.userRepository = userRepository;
    }

    @PostMapping(
        value = "/me",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> submitPayment(
        @RequestParam("method")
        Payment.PaymentMethod method,

        @RequestParam("referenceType")
        Payment.TransactionReferenceType referenceType,

        @RequestParam("referenceValue")
        @NotBlank
        String referenceValue,

        @RequestParam("screenshot")
        MultipartFile screenshot,

        Authentication authentication
    ) {

        try {

            User user = currentUser(authentication);

            PaymentResponse response =
                paymentService.submit(
                    user,
                    method,
                    referenceType,
                    referenceValue,
                    screenshot
                );

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);

        } catch (
            IllegalArgumentException |
            FileStorageException exception
        ) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                    exception.getMessage()
                ));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyPayment(
        Authentication authentication
    ) {

        try {

            User user = currentUser(authentication);

            return ResponseEntity.ok(
                paymentService.getForUser(user)
            );

        } catch (IllegalArgumentException exception) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                    exception.getMessage()
                ));
        }
    }

    @GetMapping("/me/screenshot")
    public ResponseEntity<?> getMyScreenshot(
        Authentication authentication
    ) {

        try {

            User user = currentUser(authentication);

            PaymentService.ScreenshotFile file =
                paymentService.getScreenshotForUser(user);

            return ResponseEntity.ok()
                .contentType(
                    MediaType.parseMediaType(
                        file.contentType()
                    )
                )
                .body(file.bytes());

        } catch (IllegalArgumentException exception) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                    exception.getMessage()
                ));
        }
    }

    private User currentUser(
        Authentication authentication
    ) {
        return userRepository
            .findByEmail(authentication.getName())
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "User account not found."
                )
            );
    }

    public record ErrorResponse(String message) {}
}
