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
    @Autowired
    private com.example.elearning.repository.McqQuestionRepository mcqQuestionRepository;

    @Transactional
    public Task createTask(Long courseId, CreateTaskRequest request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDayNumber(request.getDayNumber() != null ? request.getDayNumber() : 1);
        task.setCourse(course);

        // Set task type (default to CODING if not specified)
        if (request.getTaskType() != null) {
            task.setTaskType(com.example.elearning.model.TaskType.valueOf(request.getTaskType()));
        } else {
            task.setTaskType(com.example.elearning.model.TaskType.CODING);
        }

        // Handle CODING task specific fields
        if (task.getTaskType() == com.example.elearning.model.TaskType.CODING) {
            task.setStarterCode(request.getStarterCode());
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
        }

        // Save task first
        Task savedTask = taskRepository.save(task);

        // Handle MCQ task specific fields
        if (task.getTaskType() == com.example.elearning.model.TaskType.MCQ && request.getMcqQuestions() != null) {
            List<com.example.elearning.model.McqQuestion> mcqQuestions = new ArrayList<>();
            for (com.example.elearning.dto.McqQuestionDTO mqDto : request.getMcqQuestions()) {
                com.example.elearning.model.McqQuestion mq = new com.example.elearning.model.McqQuestion();
                mq.setQuestion(mqDto.getQuestion());
                mq.setOptionA(mqDto.getOptionA());
                mq.setOptionB(mqDto.getOptionB());
                mq.setOptionC(mqDto.getOptionC());
                mq.setOptionD(mqDto.getOptionD());
                mq.setCorrectAnswer(mqDto.getCorrectAnswer());
                mq.setQuestionOrder(mqDto.getQuestionOrder() != null ? mqDto.getQuestionOrder() : 1);
                mq.setTask(savedTask);
                mcqQuestions.add(mq);
            }
            mcqQuestionRepository.saveAll(mcqQuestions);
            savedTask.setMcqQuestions(mcqQuestions);
        }

        return savedTask;
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
            dto.setTaskType(task.getTaskType().toString());

            boolean isCompleted = taskCompletionRepository.existsByTaskAndUser(task, user);
            dto.setCompleted(isCompleted);

            // Include CODING task fields
            if (task.getTaskType() == com.example.elearning.model.TaskType.CODING) {
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
            }

            // Include MCQ task fields
            if (task.getTaskType() == com.example.elearning.model.TaskType.MCQ) {
                if (task.getMcqQuestions() != null) {
                    List<com.example.elearning.dto.McqQuestionDTO> mcqDTOs = task.getMcqQuestions().stream().map(mq -> {
                        com.example.elearning.dto.McqQuestionDTO mqDto = new com.example.elearning.dto.McqQuestionDTO();
                        mqDto.setId(mq.getId()); // Include question ID for frontend tracking
                        mqDto.setQuestion(mq.getQuestion());
                        mqDto.setOptionA(mq.getOptionA());
                        mqDto.setOptionB(mq.getOptionB());
                        mqDto.setOptionC(mq.getOptionC());
                        mqDto.setOptionD(mq.getOptionD());
                        // Don't send correct answer to students
                        if (user.getRole() == com.example.elearning.model.Role.TEACHER ||
                                user.getRole() == com.example.elearning.model.Role.ADMIN) {
                            mqDto.setCorrectAnswer(mq.getCorrectAnswer());
                        }
                        mqDto.setQuestionOrder(mq.getQuestionOrder());
                        return mqDto;
                    }).collect(Collectors.toList());
                    dto.setMcqQuestions(mcqDTOs);
                }
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
