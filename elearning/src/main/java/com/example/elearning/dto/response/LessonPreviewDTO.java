package com.example.elearning.dto.response;
public class LessonPreviewDTO {
    private Long id;
    private String title;
    private int orderIndex;
    private Integer dayNumber;
    public LessonPreviewDTO(Long id, String title, int orderIndex, Integer dayNumber) {
        this.id = id;
        this.title = title;
        this.orderIndex = orderIndex;
        this.dayNumber = dayNumber != null ? dayNumber : 1;
    }
    public Long getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }
    public int getOrderIndex() {
        return orderIndex;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
    public Integer getDayNumber() {
        return dayNumber;
    }
    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }
}
