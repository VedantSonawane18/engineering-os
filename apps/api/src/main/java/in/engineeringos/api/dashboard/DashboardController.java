package in.engineeringos.api.dashboard;

import in.engineeringos.api.user.User;
import in.engineeringos.api.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    public DashboardController(
        DashboardService dashboardService,
        UserRepository userRepository
    ) {
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard(
        Authentication authentication
    ) {
        User user = userRepository
            .findByEmail(authentication.getName())
            .orElseThrow();

        return ResponseEntity.ok(
            dashboardService.getDashboard(user)
        );
    }
}