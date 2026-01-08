package com.example.elearning.dto.response;

public class McqSubmissionResponseDTO {
    private Long id;
    private Long taskId;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double percentage;
    private Boolean passed;
    private String submittedAt;
    private Integer attemptNumber;
    private Integer remainingAttempts;

    public McqSubmissionResponseDTO(Long id, Long taskId, Integer totalQuestions, Integer correctAnswers,
            Double percentage, Boolean passed, String submittedAt, Integer attemptNumber, Integer remainingAttempts) {
        this.id = id;
        this.taskId = taskId;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.percentage = percentage;
        this.passed = passed;
        this.submittedAt = submittedAt;
        this.attemptNumber = attemptNumber;
        this.remainingAttempts = remainingAttempts;
    }

    public Long getId() {
        return id;
    }

    public Long getTaskId() {
        return taskId;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public Double getPercentage() {
        return percentage;
    }

    public Boolean getPassed() {
        return passed;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public Integer getRemainingAttempts() {
        return remainingAttempts;
    }
}
