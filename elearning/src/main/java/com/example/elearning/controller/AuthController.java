package com.example.elearning.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.request.LoginRequestDTO;
import com.example.elearning.dto.request.RegisterRequestDTO;
import com.example.elearning.dto.response.AuthResponseDTO;
import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.service.AuthService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/register")
	public UserResponseDTO register(@Valid @RequestBody RegisterRequestDTO dto) {
		return authService.register(dto);
	}

	@PostMapping("/login")
	public AuthResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {
		return authService.login(dto);
	}

}
