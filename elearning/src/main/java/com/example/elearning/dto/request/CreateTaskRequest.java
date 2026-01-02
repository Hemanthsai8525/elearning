package com.example.elearning.dto.request;
import com.example.elearning.dto.TestCaseDTO;
import java.util.List;
public class CreateTaskRequest {
    private String title;
    private String description;
    private String starterCode;
    private List<TestCaseDTO> testCases;
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
    public Integer getDayNumber() {
        return dayNumber;
    }
    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }
}
