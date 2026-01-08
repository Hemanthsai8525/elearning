package com.example.elearning.dto.request;

import com.example.elearning.model.TaskType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateTaskRequestDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private TaskType taskType;

    private String starterCode; // For CODING tasks

    private List<TestCaseDTO> testCases; // For CODING tasks

    private List<McqQuestionDTO> mcqQuestions; // For MCQ tasks

    private Integer dayNumber;

    public static class TestCaseDTO {
        private String input;
        private String expectedOutput;

        public String getInput() {
            return input;
        }

        public void setInput(String input) {
            this.input = input;
        }

        public String getExpectedOutput() {
            return expectedOutput;
        }

        public void setExpectedOutput(String expectedOutput) {
            this.expectedOutput = expectedOutput;
        }
    }

    public static class McqQuestionDTO {
        private String question;
        private String optionA;
        private String optionB;
        private String optionC;
        private String optionD;
        private String correctAnswer;
        private Integer questionOrder;

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getOptionA() {
            return optionA;
        }

        public void setOptionA(String optionA) {
            this.optionA = optionA;
        }

        public String getOptionB() {
            return optionB;
        }

        public void setOptionB(String optionB) {
            this.optionB = optionB;
        }

        public String getOptionC() {
            return optionC;
        }

        public void setOptionC(String optionC) {
            this.optionC = optionC;
        }

        public String getOptionD() {
            return optionD;
        }

        public void setOptionD(String optionD) {
            this.optionD = optionD;
        }

        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }

        public Integer getQuestionOrder() {
            return questionOrder;
        }

        public void setQuestionOrder(Integer questionOrder) {
            this.questionOrder = questionOrder;
        }
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

    public TaskType getTaskType() {
        return taskType;
    }

    public void setTaskType(TaskType taskType) {
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
