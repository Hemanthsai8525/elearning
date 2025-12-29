package com.example.elearning.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.response.CoursePreviewDTO;
import com.example.elearning.service.CoursePreviewService;

@RestController
@RequestMapping("/api/courses")
public class CoursePreviewController {

    private final CoursePreviewService previewService;

    public CoursePreviewController(CoursePreviewService previewService) {
        this.previewService = previewService;
    }

    @GetMapping("/{courseId}/preview")
    public CoursePreviewDTO preview(@PathVariable Long courseId) {
        return previewService.previewCourse(courseId);
    }
}
