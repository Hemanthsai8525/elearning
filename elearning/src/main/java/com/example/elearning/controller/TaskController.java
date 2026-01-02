package com.example.elearning.controller;
import com.example.elearning.dto.TaskDTO;
import com.example.elearning.dto.request.CreateTaskRequest;
import com.example.elearning.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api")
public class TaskController {
    @Autowired
    private TaskService taskService;
    @PostMapping("/courses/{courseId}/tasks")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<?> createTask(@PathVariable Long courseId, @RequestBody CreateTaskRequest request) {
        taskService.createTask(courseId, request);
        return ResponseEntity.ok("Task created successfully");
    }
    @GetMapping("/courses/{courseId}/tasks")
    public ResponseEntity<List<TaskDTO>> getTasks(@PathVariable Long courseId) {
        return ResponseEntity.ok(taskService.getTasksForCourse(courseId));
    }
    @PostMapping("/tasks/{taskId}/complete")
    public ResponseEntity<?> markComplete(@PathVariable Long taskId) {
        taskService.markTaskComplete(taskId);
        return ResponseEntity.ok("Task marked as complete");
    }
}
