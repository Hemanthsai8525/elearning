package com.example.elearning.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.request.CreateTeacherRequestDTO;
import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.service.AdminService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	private final AdminService adminService;

	public AdminController(AdminService adminService) {
		this.adminService = adminService;
	}

	@PostMapping("/create-teacher")
	public UserResponseDTO createTeacher(@Valid @RequestBody CreateTeacherRequestDTO dto) {
		return adminService.createTeacher(dto);
	}

}
