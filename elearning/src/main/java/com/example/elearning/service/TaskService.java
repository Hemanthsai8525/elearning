package com.example.elearning.service;

import com.example.elearning.dto.TaskDTO;
import com.example.elearning.dto.request.CreateTaskRequest;
import com.example.elearning.model.Course;
import com.example.elearning.model.Task;
import com.example.elearning.model.TaskCompletion;
import com.example.elearning.model.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.TaskCompletionRepository;
import com.example.elearning.repository.TaskRepository;
import com.example.elearning.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.elearning.model.TestCase;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TaskCompletionRepository taskCompletionRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Task createTask(Long courseId, CreateTaskRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStarterCode(request.getStarterCode());
        task.setDayNumber(request.getDayNumber() != null ? request.getDayNumber() : 1);
        task.setCourse(course);
        if (request.getTestCases() != null) {
            List<TestCase> testCases = new ArrayList<>();
            for (com.example.elearning.dto.TestCaseDTO tcDto : request.getTestCases()) {
                TestCase tc = new TestCase();
                tc.setInput(tcDto.getInput());
                tc.setExpectedOutput(tcDto.getExpectedOutput());
                tc.setTask(task);
                testCases.add(tc);
            }
            task.setTestCases(testCases);
        }
        return taskRepository.save(task);
    }

    public List<TaskDTO> getTasksForCourse(Long courseId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Task> tasks = taskRepository.findByCourseId(courseId);
        return tasks.stream().map(task -> {
            TaskDTO dto = new TaskDTO();
            dto.setId(task.getId());
            dto.setTitle(task.getTitle());
            dto.setDescription(task.getDescription());
            dto.setCreatedAt(task.getCreatedAt());
            dto.setDayNumber(task.getDayNumber());
            boolean isCompleted = taskCompletionRepository.existsByTaskAndUser(task, user);
            dto.setCompleted(isCompleted);
            dto.setStarterCode(task.getStarterCode());
            if (task.getTestCases() != null) {
                List<com.example.elearning.dto.TestCaseDTO> testCaseDTOs = task.getTestCases().stream().map(tc -> {
                    com.example.elearning.dto.TestCaseDTO tcDto = new com.example.elearning.dto.TestCaseDTO();
                    tcDto.setInput(tc.getInput());
                    tcDto.setExpectedOutput(tc.getExpectedOutput());
                    return tcDto;
                }).collect(Collectors.toList());
                dto.setTestCases(testCaseDTOs);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void markTaskComplete(Long taskId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (!taskCompletionRepository.existsByTaskAndUser(task, user)) {
            TaskCompletion completion = new TaskCompletion();
            completion.setTask(task);
            completion.setUser(user);
            completion.setCompleted(true);
            taskCompletionRepository.save(completion);
        }
    }

    @Transactional
    public void deleteTask(Long taskId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        if (user.getRole() == com.example.elearning.model.Role.TEACHER) {
            Course course = task.getCourse();
            if (!course.getTeacher().getId().equals(user.getId())) {
                throw new RuntimeException("You can only delete tasks from your own courses");
            }
        }
        taskRepository.delete(task);
    }
}
