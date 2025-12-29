package com.example.elearning.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.response.ProgressResponseDTO;
import com.example.elearning.service.ProgressService;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
	
	 private final ProgressService service;

	    public ProgressController(ProgressService service) {
	        this.service = service;
	    }

	    // STUDENT only
	    @PostMapping("/courses/{courseId}/lessons/{lessonId}/complete")
	    public void completeLesson(@PathVariable Long courseId,
	                               @PathVariable Long lessonId) {
	        service.markLessonCompleted(courseId, lessonId);
	    }

	    // STUDENT only
	    @GetMapping("/courses/{courseId}")
	    public ProgressResponseDTO getProgress(@PathVariable Long courseId) {
	        return service.getProgress(courseId);
	    }

}
