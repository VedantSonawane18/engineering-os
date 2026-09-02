package in.engineeringos.api.profile;

import in.engineeringos.api.user.User;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "student_profiles",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_student_profiles_user",
            columnNames = "user_id"
        )
    }
)
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "user_id",
        nullable = false,
        unique = true
    )
    private User user;

    @Column
    private String college;

    @Column
    private String branch;

    @Column
    private Integer graduationYear;

    @Column
    private Integer semester;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public Integer getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(Integer graduationYear) {
        this.graduationYear = graduationYear;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}