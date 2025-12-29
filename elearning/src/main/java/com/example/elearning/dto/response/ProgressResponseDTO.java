package com.example.elearning.dto.response;

public class ProgressResponseDTO {

	private Long courseId;
	private int completedLessons;
	private int totalLessons;
	private int progressPercentage;

	public ProgressResponseDTO(Long courseId, int completedLessons, int totalLessons, int progressPercentage) {
		super();
		this.courseId = courseId;
		this.completedLessons = completedLessons;
		this.totalLessons = totalLessons;
		this.progressPercentage = progressPercentage;
	}

	public Long getCourseId() {
		return courseId;
	}

	public int getCompletedLessons() {
		return completedLessons;
	}

	public int getTotalLessons() {
		return totalLessons;
	}

	public int getProgressPercentage() {
		return progressPercentage;
	}

}
