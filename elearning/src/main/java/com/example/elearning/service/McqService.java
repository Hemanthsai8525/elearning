package com.example.elearning.service;

import com.example.elearning.dto.request.SubmitMcqDTO;
import com.example.elearning.dto.response.McqSubmissionResponseDTO;
import com.example.elearning.model.*;
import com.example.elearning.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

@Service
public class McqService {
    private final McqSubmissionRepository submissionRepo;
    private final McqQuestionRepository questionRepo;
    private final TaskRepository taskRepo;
    private final UserRepository userRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public McqService(McqSubmissionRepository submissionRepo, McqQuestionRepository questionRepo,
            TaskRepository taskRepo, UserRepository userRepo) {
        this.submissionRepo = submissionRepo;
        this.questionRepo = questionRepo;
        this.taskRepo = taskRepo;
        this.userRepo = userRepo;
    }

    public McqSubmissionResponseDTO submitMcq(SubmitMcqDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = taskRepo.findById(dto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (task.getTaskType() != TaskType.MCQ) {
            throw new RuntimeException("Task is not an MCQ task");
        }

        // Check number of attempts (allow maximum 2)
        // Check number of attempts (allow maximum 2)
        var existingSubmissions = submissionRepo.findByTaskIdAndStudentIdOrderByAttemptNumberDesc(task.getId(),
                student.getId());
        int currentAttemptNumber = 1;

        if (!existingSubmissions.isEmpty()) {
            int lastAttempt = existingSubmissions.get(0).getAttemptNumber();
            if (lastAttempt >= 2) {
                throw new RuntimeException("Maximum 2 attempts allowed. You have already used all attempts.");
            }
            currentAttemptNumber = lastAttempt + 1;
        }

        // Get all questions
        var questions = questionRepo.findByTaskIdOrderByQuestionOrderAsc(task.getId());

        // Parse answers
        Map<String, String> answers;
        try {
            answers = objectMapper.readValue(dto.getAnswers(), Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid answers format");
        }

        // Grade the submission
        int correctCount = 0;
        for (McqQuestion question : questions) {
            String studentAnswer = answers.get(question.getId().toString());
            if (studentAnswer != null && studentAnswer.equals(question.getCorrectAnswer())) {
                correctCount++;
            }
        }

        int totalQuestions = questions.size();
        double percentage = totalQuestions > 0 ? (correctCount * 100.0 / totalQuestions) : 0;
        boolean passed = percentage >= 60;

        // Save submission
        McqSubmission submission = new McqSubmission();
        submission.setTask(task);
        submission.setStudent(student);
        submission.setTotalQuestions(totalQuestions);
        submission.setCorrectAnswers(correctCount);
        submission.setPercentage(percentage);
        submission.setPassed(passed);
        submission.setAnswers(dto.getAnswers());
        submission.setAttemptNumber(currentAttemptNumber); // Set attempt number (1 or 2)

        McqSubmission saved = submissionRepo.save(submission);

        return new McqSubmissionResponseDTO(
                saved.getId(),
                task.getId(),
                totalQuestions,
                correctCount,
                percentage,
                passed,
                saved.getSubmittedAt().toString(),
                saved.getAttemptNumber(),
                2 - saved.getAttemptNumber()); // remaining attempts
    }

    public McqSubmissionResponseDTO getSubmission(Long taskId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get all submissions for this task and student
        var submissions = submissionRepo.findByTaskIdAndStudentIdOrderByAttemptNumberDesc(taskId, student.getId());

        if (submissions.isEmpty()) {
            throw new RuntimeException("No submission found");
        }

        // Return the best attempt (highest percentage)
        McqSubmission bestSubmission = submissions.stream()
                .max((s1, s2) -> Double.compare(s1.getPercentage(), s2.getPercentage()))
                .orElse(submissions.get(0));

        long totalAttempts = submissions.size();

        return new McqSubmissionResponseDTO(
                bestSubmission.getId(),
                taskId,
                bestSubmission.getTotalQuestions(),
                bestSubmission.getCorrectAnswers(),
                bestSubmission.getPercentage(),
                bestSubmission.getPassed(),
                bestSubmission.getSubmittedAt().toString(),
                bestSubmission.getAttemptNumber(),
                (int) (2 - totalAttempts)); // remaining attempts
    }
}
