package com.example.elearning.dto.response;

public class LessonPreviewDTO {

    private Long id;
    private String title;
    private int orderIndex;

    public LessonPreviewDTO(Long id, String title, int orderIndex) {
        this.id = id;
        this.title = title;
        this.orderIndex = orderIndex;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
