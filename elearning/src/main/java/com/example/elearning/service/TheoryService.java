package com.example.elearning.service;

import com.example.elearning.dto.request.ReviewTheorySubmissionDTO;
import com.example.elearning.dto.response.TheorySubmissionResponseDTO;
import com.example.elearning.model.*;
import com.example.elearning.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TheoryService {
        private final TheorySubmissionRepository submissionRepo;
        private final TaskRepository taskRepo;
        private final UserRepository userRepo;
        private final NotificationService notificationService;

        @Value("${file.upload-dir:uploads/theory}")
        private String uploadDir;

        public TheoryService(TheorySubmissionRepository submissionRepo, TaskRepository taskRepo,
                        UserRepository userRepo, NotificationService notificationService) {
                this.submissionRepo = submissionRepo;
                this.taskRepo = taskRepo;
                this.userRepo = userRepo;
                this.notificationService = notificationService;
        }

        public TheorySubmissionResponseDTO submitTheory(Long taskId, MultipartFile file) {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                User student = userRepo.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Task task = taskRepo.findById(taskId)
                                .orElseThrow(() -> new RuntimeException("Task not found"));

                if (task.getTaskType() != TaskType.THEORY) {
                        throw new RuntimeException("Task is not a theory task");
                }

                // Check if already submitted
                submissionRepo.findByTaskIdAndStudentId(taskId, student.getId())
                                .ifPresent(s -> {
                                        throw new RuntimeException("Theory assignment already submitted");
                                });

                // Save file
                String fileName = file.getOriginalFilename();
                String fileExtension = fileName.substring(fileName.lastIndexOf("."));
                String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

                Path uploadPath = Paths.get(uploadDir, taskId.toString(), student.getId().toString());
                try {
                        Files.createDirectories(uploadPath);
                        Path filePath = uploadPath.resolve(uniqueFileName);
                        Files.copy(file.getInputStream(), filePath);
                } catch (IOException e) {
                        throw new RuntimeException("Failed to save file: " + e.getMessage());
                }

                // Create submission
                TheorySubmission submission = new TheorySubmission();
                submission.setTask(task);
                submission.setStudent(student);
                submission.setFileName(fileName);
                submission.setFileUrl(uploadPath.resolve(uniqueFileName).toString());
                submission.setStatus(TheorySubmission.SubmissionStatus.PENDING);

                TheorySubmission saved = submissionRepo.save(submission);

                User teacher = task.getCourse().getTeacher();
                notificationService.notify(teacher,
                                "New submission by " + student.getName() + " for task: " + task.getTitle(),
                                "SUBMISSION", task.getId());

                return mapToDTO(saved);
        }

        public TheorySubmissionResponseDTO getStudentSubmission(Long taskId) {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                User student = userRepo.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                TheorySubmission submission = submissionRepo.findByTaskIdAndStudentId(taskId, student.getId())
                                .orElseThrow(() -> new RuntimeException("No submission found"));

                return mapToDTO(submission);
        }

        public List<TheorySubmissionResponseDTO> getAllSubmissions(Long taskId) {
                return submissionRepo.findByTaskId(taskId).stream()
                                .map(this::mapToDTO)
                                .collect(Collectors.toList());
        }

        public TheorySubmissionResponseDTO reviewSubmission(Long submissionId, ReviewTheorySubmissionDTO dto) {
                TheorySubmission submission = submissionRepo.findById(submissionId)
                                .orElseThrow(() -> new RuntimeException("Submission not found"));

                TheorySubmission.SubmissionStatus status = TheorySubmission.SubmissionStatus.valueOf(dto.getStatus());
                submission.setStatus(status);
                submission.setPercentage(dto.getPercentage());
                submission.setTeacherFeedback(dto.getTeacherFeedback());
                submission.setReviewedAt(LocalDateTime.now());

                TheorySubmission saved = submissionRepo.save(submission);

                // Notify Student
                String message = "Your assignment for '" + submission.getTask().getTitle()
                                + "' has been reviewed. Status: "
                                + status;
                notificationService.notify(submission.getStudent(), message, "REVIEW",
                                submission.getTask().getCourse().getId());

                return mapToDTO(saved);
        }

        public Path getSubmissionFile(Long submissionId) {
                TheorySubmission submission = submissionRepo.findById(submissionId)
                                .orElseThrow(() -> new RuntimeException("Submission not found"));
                return Paths.get(submission.getFileUrl());
        }

        private TheorySubmissionResponseDTO mapToDTO(TheorySubmission submission) {
                return new TheorySubmissionResponseDTO(
                                submission.getId(),
                                submission.getTask().getId(),
                                submission.getStudent().getName(),
                                submission.getFileName(),
                                submission.getStatus().toString(),
                                submission.getPercentage(),
                                submission.getTeacherFeedback(),
                                submission.getSubmittedAt().toString(),
                                submission.getReviewedAt() != null ? submission.getReviewedAt().toString() : null);
        }
}
