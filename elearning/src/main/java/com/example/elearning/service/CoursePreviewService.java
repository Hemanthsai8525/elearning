package com.example.elearning.service;
import java.util.List;
import org.springframework.stereotype.Service;
import com.example.elearning.dto.response.CoursePreviewDTO;
import com.example.elearning.dto.response.LessonPreviewDTO;
import com.example.elearning.model.Course;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.LessonRepository;
@Service
public class CoursePreviewService {
        private final CourseRepository courseRepo;
        private final LessonRepository lessonRepo;
        public CoursePreviewService(CourseRepository courseRepo,
                        LessonRepository lessonRepo) {
                this.courseRepo = courseRepo;
                this.lessonRepo = lessonRepo;
        }
        public CoursePreviewDTO previewCourse(Long courseId) {
                Course course = courseRepo.findById(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));
                List<LessonPreviewDTO> lessons = lessonRepo.findByCourseIdOrderByOrderIndexAsc(courseId)
                                .stream()
                                .map(l -> new LessonPreviewDTO(
                                                l.getId(),
                                                l.getTitle(),
                                                l.getLessonOrder(),
                                                l.getDayNumber()))
                                .toList();
                return new CoursePreviewDTO(
                                course.getId(),
                                course.getTitle(),
                                course.getDescription(),
                                course.isPaid(),
                                course.getPrice(),
                                course.getTeacher().getName(),
                                lessons);
        }
}
