package com.example.elearning.dto.request;

import jakarta.validation.constraints.NotNull;

public class MarkLessonCompleteRequestDTO {

	@NotNull
    private Long lessonId;

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }
}
