package com.example.elearning.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.request.CreateLessonRequestDTO;
import com.example.elearning.dto.response.LessonResponseDTO;
import com.example.elearning.service.LessonService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/courses/{courseId}/lessons")
public class LessonController {
	
	private final LessonService service;
	
	public LessonController(LessonService service) {
		this.service = service;
	}
	
	@PostMapping
	public LessonResponseDTO addLesson(@PathVariable Long courseId, @Valid @RequestBody CreateLessonRequestDTO dto) {
		return service.addLesson(courseId, dto);
	}
	
	@GetMapping
	public List<LessonResponseDTO> getLesson(@PathVariable Long courseId){
		return service.getLessonsByCourse(courseId);
	}

}
