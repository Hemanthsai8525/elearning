package com.example.elearning.dto;

import java.time.LocalDateTime;

public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private boolean completed;
    private String taskType;
    private String starterCode;
    private java.util.List<TestCaseDTO> testCases;
    private java.util.List<McqQuestionDTO> mcqQuestions;
    private Integer dayNumber = 1;

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

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    public String getStarterCode() {
        return starterCode;
    }

    public void setStarterCode(String starterCode) {
        this.starterCode = starterCode;
    }

    public java.util.List<TestCaseDTO> getTestCases() {
        return testCases;
    }

    public void setTestCases(java.util.List<TestCaseDTO> testCases) {
        this.testCases = testCases;
    }

    public java.util.List<McqQuestionDTO> getMcqQuestions() {
        return mcqQuestions;
    }

    public void setMcqQuestions(java.util.List<McqQuestionDTO> mcqQuestions) {
        this.mcqQuestions = mcqQuestions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Integer getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }
}
