package com.example.elearning.service;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.elearning.dto.request.CreateCourseRequestDTO;
import com.example.elearning.dto.response.CourseResponseDTO;
import com.example.elearning.model.Course;
import com.example.elearning.model.Role;
import com.example.elearning.model.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.repository.LessonRepository;
import com.example.elearning.repository.EnrollmentRepository;
@Service
public class CourseService {
    private final CourseRepository courseRepo;
    private final UserRepository userRepo;
    private final EmailService emailService;
    private final LessonRepository lessonRepo;
    private final EnrollmentRepository enrollmentRepo;
    public CourseService(CourseRepository courseRepo, UserRepository userRepo, EmailService emailService,
            LessonRepository lessonRepo, EnrollmentRepository enrollmentRepo) {
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.lessonRepo = lessonRepo;
        this.enrollmentRepo = enrollmentRepo;
    }
    public CourseResponseDTO createCourse(CreateCourseRequestDTO dto) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User teacher = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (teacher.getRole() != Role.TEACHER) {
            throw new RuntimeException("Only teachers can create courses");
        }
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setPaid(dto.isPaid());
        course.setPrice(dto.isPaid() ? dto.getPrice() : 0.0);
        course.setTeacher(teacher);
        course.setPublished(true);
        Course saved = courseRepo.save(course);
        new Thread(() -> {
            try {
                List<User> students = userRepo.findByRole(Role.STUDENT);
                String subject = "New Course Alert: " + saved.getTitle();
                String bodyTemplate = "Hello %s,\n\nA new course '%s' has been published by %s.\n\nDescription: %s\n\nCheck it out on the platform!";
                for (User student : students) {
                    try {
                        String body = String.format(bodyTemplate, student.getName(), saved.getTitle(),
                                teacher.getName(), saved.getDescription());
                        emailService.send(student.getEmail(), subject, body);
                    } catch (Exception e) {
                        System.err.println("Failed to send email to " + student.getEmail());
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
        return new CourseResponseDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.isPaid(),
                saved.getPrice(),
                teacher.getName(),
                0L,
                0L);
    }
    public void deleteCourse(Long courseId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (user.getRole() == Role.ADMIN ||
                (user.getRole() == Role.TEACHER && course.getTeacher().getId().equals(user.getId()))) {
            courseRepo.delete(course);
        } else {
            throw new RuntimeException("Not authorized to delete this course");
        }
    }
    public List<CourseResponseDTO> getAllCourses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || email.equals("anonymousUser")) {
            return courseRepo.findByPublishedTrue().stream()
                    .map(this::mapToDTO) 
                    .toList();
        }
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Course> courses;
        if (user.getRole() == Role.TEACHER) {
            courses = courseRepo.findByTeacherId(user.getId());
        } else {
            courses = courseRepo.findByPublishedTrue(); 
        }
        return courses.stream()
                .map(this::mapToDTO)
                .toList();
    }
    private CourseResponseDTO mapToDTO(Course c) {
        return new CourseResponseDTO(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.isPaid(),
                c.getPrice(),
                c.getTeacher().getName(),
                lessonRepo.countByCourseId(c.getId()),
                enrollmentRepo.countByCourseId(c.getId()));
    }
}
