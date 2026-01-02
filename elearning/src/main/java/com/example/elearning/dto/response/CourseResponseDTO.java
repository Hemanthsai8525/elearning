package com.example.elearning.dto.response;
public class CourseResponseDTO {
	private Long id;
	private String title;
	private String description;
	private boolean paid;
	private Double price;
	private String teacherName;
	private Long lessonCount;
	private Long studentCount;
	public CourseResponseDTO(Long id, String title, String description, boolean paid, Double price,
			String teacherName, Long lessonCount, Long studentCount) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.paid = paid;
		this.price = price;
		this.teacherName = teacherName;
		this.lessonCount = lessonCount;
		this.studentCount = studentCount;
	}
	public boolean isPaid() {
		return paid;
	}
	public void setPaid(boolean paid) {
		this.paid = paid;
	}
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getTeacherName() {
		return teacherName;
	}
	public void setTeacherName(String teacherName) {
		this.teacherName = teacherName;
	}
	public Long getLessonCount() {
		return lessonCount;
	}
	public void setLessonCount(Long lessonCount) {
		this.lessonCount = lessonCount;
	}
	public Long getStudentCount() {
		return studentCount;
	}
	public void setStudentCount(Long studentCount) {
		this.studentCount = studentCount;
	}
}
