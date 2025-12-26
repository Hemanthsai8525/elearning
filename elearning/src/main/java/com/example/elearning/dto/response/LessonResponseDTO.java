package com.example.elearning.dto.response;

public class LessonResponseDTO {

    private Long id;
    private String title;
    private String videoUrl;
    private int lessonOrder;

    public LessonResponseDTO(Long id, String title, String videoUrl, int lessonOrder) {
        this.id = id;
        this.title = title;
        this.videoUrl = videoUrl;
        this.lessonOrder = lessonOrder;
    }

    // getters
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
}
