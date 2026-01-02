package com.example.elearning.dto.response;
import java.time.LocalDateTime;
public class CertificateResponseDTO {
    private Long id;
    private String studentName;
    private String courseTitle;
    private String certificateCode;
    private LocalDateTime issuedAt;
    private int completionPercentage;
    public CertificateResponseDTO(Long id, String studentName, String courseTitle,
            String certificateCode, LocalDateTime issuedAt,
            int completionPercentage) {
        this.id = id;
        this.studentName = studentName;
        this.courseTitle = courseTitle;
        this.certificateCode = certificateCode;
        this.issuedAt = issuedAt;
        this.completionPercentage = completionPercentage;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getStudentName() {
        return studentName;
    }
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    public String getCourseTitle() {
        return courseTitle;
    }
    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
    public String getCertificateCode() {
        return certificateCode;
    }
    public void setCertificateCode(String certificateCode) {
        this.certificateCode = certificateCode;
    }
    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }
    public void setIssuedAt(LocalDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
    public int getCompletionPercentage() {
        return completionPercentage;
    }
    public void setCompletionPercentage(int completionPercentage) {
        this.completionPercentage = completionPercentage;
    }
}
