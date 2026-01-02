package com.example.elearning.dto.response;
public class LessonResponseDTO {
    private Long id;
    private String title;
    private String videoUrl;
    private int lessonOrder;
    private Integer dayNumber;
    public LessonResponseDTO(Long id, String title, String videoUrl, int lessonOrder, Integer dayNumber) {
        this.id = id;
        this.title = title;
        this.videoUrl = videoUrl;
        this.lessonOrder = lessonOrder;
        this.dayNumber = dayNumber != null ? dayNumber : 1;
    }
    public Long getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }
    public String getVideoUrl() {
        return videoUrl;
    }
    public int getLessonOrder() {
        return lessonOrder;
    }
    public Integer getDayNumber() {
        return dayNumber;
    }
}
