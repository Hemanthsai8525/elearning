package com.example.elearning.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.request.CreateTeacherRequestDTO;
import com.example.elearning.dto.response.AdminAnalyticsDTO;
import com.example.elearning.dto.response.AdminUserResponseDTO;
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

	@org.springframework.web.bind.annotation.DeleteMapping("/users/{id}")
	public org.springframework.http.ResponseEntity<Void> deleteUser(
			@org.springframework.web.bind.annotation.PathVariable Long id) {
		adminService.deleteUser(id);
		return org.springframework.http.ResponseEntity.noContent().build();
	}

	@org.springframework.web.bind.annotation.PutMapping("/users/{id}/role")
	public org.springframework.http.ResponseEntity<Void> updateUserRole(
			@org.springframework.web.bind.annotation.PathVariable Long id,
			@RequestBody java.util.Map<String, String> payload) {
		adminService.updateUserRole(id, payload.get("role"));
		return org.springframework.http.ResponseEntity.ok().build();
	}

	@org.springframework.web.bind.annotation.PutMapping("/users/{id}/block")
	public org.springframework.http.ResponseEntity<Void> toggleUserBlockStatus(
			@org.springframework.web.bind.annotation.PathVariable Long id) {
		adminService.toggleUserBlockStatus(id);
		return org.springframework.http.ResponseEntity.ok().build();
	}

	@GetMapping("/users")
	public List<AdminUserResponseDTO> getAllUsers() {
		return adminService.getAllUsers();
	}

	@GetMapping("/analytics")
	public AdminAnalyticsDTO getAnalytics() {
		return adminService.getAnalytics();
	}
}
