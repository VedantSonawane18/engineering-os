package in.engineeringos.api.profile;

import in.engineeringos.api.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final StudentProfileRepository profileRepository;

    public ProfileService(
        StudentProfileRepository profileRepository
    ) {
        this.profileRepository = profileRepository;
    }

    @Transactional
    public StudentProfile getOrCreate(User user) {

        return profileRepository
            .findByUserId(user.getId())
            .orElseGet(() -> {
                StudentProfile profile = new StudentProfile();
                profile.setUser(user);
                return profileRepository.save(profile);
            });
    }

    @Transactional
    public ProfileResponse getProfile(User user) {

        StudentProfile profile = getOrCreate(user);

        return new ProfileResponse(
            user.getId().toString(),
            user.getFullName(),
            user.getEmail(),
            profile.getCollege(),
            profile.getBranch(),
            profile.getGraduationYear(),
            profile.getSemester()
        );
    }
}