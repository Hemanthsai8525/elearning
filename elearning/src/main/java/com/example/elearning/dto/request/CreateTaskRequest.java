package com.example.elearning.dto.request;

import com.example.elearning.dto.TestCaseDTO;
import com.example.elearning.dto.McqQuestionDTO;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CreateTaskRequest {
    @NotBlank(message = "Task title is required")
    private String title;

    @NotBlank(message = "Task description is required")
    private String description;

    private String taskType; // CODING, MCQ, or THEORY

    private String starterCode; // For CODING tasks

    private List<TestCaseDTO> testCases; // For CODING tasks

    private List<McqQuestionDTO> mcqQuestions; // For MCQ tasks

    private Integer dayNumber = 1;

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

    public List<TestCaseDTO> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<TestCaseDTO> testCases) {
        this.testCases = testCases;
    }

    public List<McqQuestionDTO> getMcqQuestions() {
        return mcqQuestions;
    }

    public void setMcqQuestions(List<McqQuestionDTO> mcqQuestions) {
        this.mcqQuestions = mcqQuestions;
    }

    public Integer getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }
}
