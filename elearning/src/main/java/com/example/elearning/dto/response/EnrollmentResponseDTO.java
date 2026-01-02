package com.example.elearning.dto.response;
import java.time.LocalDateTime;
public class EnrollmentResponseDTO {
	private Long courseId;
	private String courseTitle;
	private LocalDateTime enrolledAt;
	private String teacherName;
	private int progressPercentage;
	public EnrollmentResponseDTO(Long courseId, String courseTitle, LocalDateTime enrolledAt, String teacherName,
			int progressPercentage) {
		super();
		this.courseId = courseId;
		this.courseTitle = courseTitle;
		this.enrolledAt = enrolledAt;
		this.teacherName = teacherName;
		this.progressPercentage = progressPercentage;
	}
	public Long getCourseId() {
		return courseId;
	}
	public String getCourseTitle() {
		return courseTitle;
	}
	public LocalDateTime getEnrolledAt() {
		return enrolledAt;
	}
	public String getTeacherName() {
		return teacherName;
	}
	public int getProgressPercentage() {
		return progressPercentage;
	}
}
