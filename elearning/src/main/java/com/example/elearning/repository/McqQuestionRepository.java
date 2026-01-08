package com.example.elearning.repository;

import com.example.elearning.model.McqQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface McqQuestionRepository extends JpaRepository<McqQuestion, Long> {
    List<McqQuestion> findByTaskIdOrderByQuestionOrderAsc(Long taskId);
}
