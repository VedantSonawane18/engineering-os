package in.engineeringos.api.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/students")
    public ResponseEntity<List<AdminStudentResponse>> getStudents() {
        return ResponseEntity.ok(
            adminService.getStudents()
        );
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<AdminStudentResponse> getStudent(
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
            adminService.getStudent(id)
        );
    }

    @PostMapping("/students/{id}/review")
    public ResponseEntity<AdminStudentResponse> markUnderReview(
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
            adminService.markUnderReview(id)
        );
    }

    @PostMapping("/students/{id}/approve")
    public ResponseEntity<AdminStudentResponse> approve(
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
            adminService.approve(id)
        );
    }

    @PostMapping("/students/{id}/reject")
    public ResponseEntity<AdminStudentResponse> reject(
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
            adminService.reject(id)
        );
    }
   @DeleteMapping("/students/{id}")
   public ResponseEntity<Void> deleteStudent(
      @PathVariable UUID id
   ) {
      adminService.deleteStudent(id);

      return ResponseEntity.noContent().build();
   }
}