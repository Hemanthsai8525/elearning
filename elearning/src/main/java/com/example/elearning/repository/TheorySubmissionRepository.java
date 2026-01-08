package com.example.elearning.repository;

import com.example.elearning.model.TheorySubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TheorySubmissionRepository extends JpaRepository<TheorySubmission, Long> {
    Optional<TheorySubmission> findByTaskIdAndStudentId(Long taskId, Long studentId);

    List<TheorySubmission> findByTaskId(Long taskId);
}
