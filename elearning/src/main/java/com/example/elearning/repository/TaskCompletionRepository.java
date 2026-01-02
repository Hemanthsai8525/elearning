package com.example.elearning.repository;
import com.example.elearning.model.Task;
import com.example.elearning.model.TaskCompletion;
import com.example.elearning.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
public interface TaskCompletionRepository extends JpaRepository<TaskCompletion, Long> {
    Optional<TaskCompletion> findByTaskAndUser(Task task, User user);
    boolean existsByTaskAndUser(Task task, User user);
    List<TaskCompletion> findByUser(User user);
    List<TaskCompletion> findByTaskId(Long taskId);
}
