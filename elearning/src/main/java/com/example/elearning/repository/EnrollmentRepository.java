package com.example.elearning.repository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.elearning.model.Enrollment;
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
	boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
	List<Enrollment> findByStudentId(Long studentId);
	Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
	List<Enrollment> findByCourseId(Long courseId);
	long countByCourseId(Long courseId);
}
