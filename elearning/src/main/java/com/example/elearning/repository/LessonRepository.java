package com.example.elearning.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.elearning.model.Lesson;
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderByLessonOrderAsc(Long courseId);
    default List<Lesson> findByCourseIdOrderByOrderIndexAsc(Long courseId) {
        return findByCourseIdOrderByLessonOrderAsc(courseId);
    }
    List<Lesson> findByCourseId(Long courseId);
    long countByCourseId(Long courseId);
}
