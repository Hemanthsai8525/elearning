package com.example.elearning.repository;

import com.example.elearning.model.McqSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface McqSubmissionRepository extends JpaRepository<McqSubmission, Long> {
    Optional<McqSubmission> findByTaskIdAndStudentId(Long taskId, Long studentId);

    java.util.List<McqSubmission> findByTaskIdAndStudentIdOrderByAttemptNumberDesc(Long taskId, Long studentId);

    long countByTaskIdAndStudentId(Long taskId, Long studentId);
}
