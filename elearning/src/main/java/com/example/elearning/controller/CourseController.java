package com.example.elearning.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.request.CreateCourseRequestDTO;
import com.example.elearning.dto.response.CourseResponseDTO;
import com.example.elearning.service.CourseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
	
	private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    // TEACHER only
    @PostMapping
    public CourseResponseDTO createCourse(
            @Valid @RequestBody CreateCourseRequestDTO dto) {
        return service.createCourse(dto);
    }

    // STUDENT + TEACHER
    @GetMapping
    public List<CourseResponseDTO> getCourses() {
        return service.getAllCourses();
    }

}
