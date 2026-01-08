package com.example.elearning.dto.response;

public class TheorySubmissionResponseDTO {
    private Long id;
    private Long taskId;
    private String studentName;
    private String fileName;
    private String status; // PENDING, PASS, FAIL
    private Double percentage;
    private String teacherFeedback;
    private String submittedAt;
    private String reviewedAt;

    public TheorySubmissionResponseDTO(Long id, Long taskId, String studentName, String fileName,
            String status, Double percentage, String teacherFeedback,
            String submittedAt, String reviewedAt) {
        this.id = id;
        this.taskId = taskId;
        this.studentName = studentName;
        this.fileName = fileName;
        this.status = status;
        this.percentage = percentage;
        this.teacherFeedback = teacherFeedback;
        this.submittedAt = submittedAt;
        this.reviewedAt = reviewedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getTaskId() {
        return taskId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getFileName() {
        return fileName;
    }

    public String getStatus() {
        return status;
    }

    public Double getPercentage() {
        return percentage;
    }

    public String getTeacherFeedback() {
        return teacherFeedback;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public String getReviewedAt() {
        return reviewedAt;
    }
}
