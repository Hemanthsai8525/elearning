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

@Service
public class CourseService {

    private final CourseRepository courseRepo;
    private final UserRepository userRepo;

    public CourseService(CourseRepository courseRepo, UserRepository userRepo) {
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }

    // TEACHER only
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

        return new CourseResponseDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getDescription(),
                saved.isPaid(),
                saved.getPrice(),
                teacher.getName());
    }

    // STUDENT + TEACHER + PUBLIC
    public List<CourseResponseDTO> getAllCourses() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        if (email == null || email.equals("anonymousUser")) {
            return courseRepo.findByPublishedTrue().stream()
                    .map(this::mapToDTO) // Refactored to helper method for cleanliness
                    .toList();
        }

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Course> courses;

        if (user.getRole() == Role.TEACHER) {
            courses = courseRepo.findByTeacherId(user.getId());
        } else {
            courses = courseRepo.findByPublishedTrue(); // Students and others see published courses
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
                c.getTeacher().getName());
    }

}
