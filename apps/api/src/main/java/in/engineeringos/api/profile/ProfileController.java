package in.engineeringos.api.profile;

import in.engineeringos.api.user.User;
import in.engineeringos.api.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    public ProfileController(
        ProfileService profileService,
        UserRepository userRepository
    ) {
        this.profileService = profileService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(
        Authentication authentication
    ) {
        User user = userRepository
            .findByEmail(authentication.getName())
            .orElseThrow();

        return ResponseEntity.ok(
            profileService.getProfile(user)
        );
    }
}