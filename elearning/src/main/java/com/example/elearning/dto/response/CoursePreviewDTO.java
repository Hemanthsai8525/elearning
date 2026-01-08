package com.example.elearning.dto.response;

import java.util.List;

public class CoursePreviewDTO {
    private Long courseId;
    private String title;
    private String description;
    private boolean paid;
    private Double price;
    private String teacherName;
    private List<LessonPreviewDTO> lessons;
    private boolean published;

    public CoursePreviewDTO(Long courseId,
            String title,
            String description,
            boolean paid,
            Double price,
            String teacherName,
            List<LessonPreviewDTO> lessons,
            boolean published) {
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.paid = paid;
        this.price = price;
        this.teacherName = teacherName;
        this.lessons = lessons;
        this.published = published;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public boolean isPaid() {
        return paid;
    }

    public Double getPrice() {
        return price;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public List<LessonPreviewDTO> getLessons() {
        return lessons;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public void setLessons(List<LessonPreviewDTO> lessons) {
        this.lessons = lessons;
    }
}
