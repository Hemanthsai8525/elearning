package com.example.elearning.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.elearning.model.Payment;
public interface PaymentRepository extends JpaRepository<Payment, Long> {
	Optional<Payment> findByStudentIdAndCourseIdAndStatus(Long studentId, Long courseId, String status);
}
