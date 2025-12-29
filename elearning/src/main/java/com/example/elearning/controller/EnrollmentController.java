package com.example.elearning.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.response.EnrollmentResponseDTO;
import com.example.elearning.service.EnrollmentService;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

	private final EnrollmentService service;

	public EnrollmentController(EnrollmentService service) {
		this.service = service;
	}

	@PostMapping("/{courseId}")
	public EnrollmentResponseDTO enroll(@PathVariable Long courseId) {
		return service.enroll(courseId);
	}

	@GetMapping("/me")
	public List<EnrollmentResponseDTO> myEnrollments() {
		return service.myEnrollments();
	}
}
