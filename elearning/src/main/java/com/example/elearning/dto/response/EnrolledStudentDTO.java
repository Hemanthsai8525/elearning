package com.example.elearning.dto.response;
import java.time.LocalDateTime;
public class EnrolledStudentDTO {
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private LocalDateTime enrolledAt;
    private int progressPercentage;
    public EnrolledStudentDTO(Long studentId, String studentName, String studentEmail, LocalDateTime enrolledAt,
            int progressPercentage) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.enrolledAt = enrolledAt;
        this.progressPercentage = progressPercentage;
    }
    public Long getStudentId() {
        return studentId;
    }
    public String getStudentName() {
        return studentName;
    }
    public String getStudentEmail() {
        return studentEmail;
    }
    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }
    public int getProgressPercentage() {
        return progressPercentage;
    }
}
