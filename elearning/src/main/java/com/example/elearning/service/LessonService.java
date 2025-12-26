package com.example.elearning.service;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.elearning.dto.request.CreateLessonRequestDTO;
import com.example.elearning.dto.response.LessonResponseDTO;
import com.example.elearning.model.Course;
import com.example.elearning.model.Lesson;
import com.example.elearning.model.Role;
import com.example.elearning.model.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.LessonRepository;
import com.example.elearning.repository.UserRepository;

@Service
public class LessonService {
	
	private final LessonRepository lessonRepo;
    private final CourseRepository courseRepo;
    private final UserRepository userRepo;

    public LessonService(LessonRepository lessonRepo,
                         CourseRepository courseRepo,
                         UserRepository userRepo) {
        this.lessonRepo = lessonRepo;
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }

    // TEACHER ONLY – add lesson to own course
    public LessonResponseDTO addLesson(Long courseId, CreateLessonRequestDTO dto) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User teacher = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (teacher.getRole() != Role.TEACHER) {
            throw new RuntimeException("Only teachers can add lessons");
        }

        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Ensure teacher owns the course
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("You do not own this course");
        }

        Lesson lesson = new Lesson();
        lesson.setTitle(dto.getTitle());
        lesson.setVideoUrl(dto.getVideoUrl());
        lesson.setLessonOrder(dto.getLessonOrder());
        lesson.setCourse(course);

        Lesson saved = lessonRepo.save(lesson);

        return new LessonResponseDTO(
                saved.getId(),
                saved.getTitle(),
                saved.getVideoUrl(),
                saved.getLessonOrder()
        );
    }

    // STUDENT + TEACHER – view lessons
    public List<LessonResponseDTO> getLessonsByCourse(Long courseId) {

        return lessonRepo.findByCourseIdOrderByLessonOrderAsc(courseId)
                .stream()
                .map(l -> new LessonResponseDTO(
                        l.getId(),
                        l.getTitle(),
                        l.getVideoUrl(),
                        l.getLessonOrder()
                ))
                .toList();
    }

}
