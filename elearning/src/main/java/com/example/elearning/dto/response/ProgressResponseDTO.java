package com.example.elearning.dto.response;

public class ProgressResponseDTO {

	private Long courseId;
	private int completedLessons;
	private int totalLessons;
	private int progressPercentage;
	private java.util.List<Long> completedLessonIds;

	public ProgressResponseDTO(Long courseId, int completedLessons, int totalLessons, int progressPercentage,
			java.util.List<Long> completedLessonIds) {
		super();
		this.courseId = courseId;
		this.completedLessons = completedLessons;
		this.totalLessons = totalLessons;
		this.progressPercentage = progressPercentage;
		this.completedLessonIds = completedLessonIds;
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

	public java.util.List<Long> getCompletedLessonIds() {
		return completedLessonIds;
	}

}
