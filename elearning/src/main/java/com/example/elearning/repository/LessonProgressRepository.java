package com.example.elearning.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.elearning.model.LessonProgress;
public interface LessonProgressRepository extends JpaRepository<LessonProgress,Long> {
	boolean existsByEnrollmentIdAndLessonId(Long enrollmentId,Long lessonId);
	List<LessonProgress> findByEnrollmentId(Long enrollmentId);
	long countByEnrollmentId(Long enrollmentId);
}
