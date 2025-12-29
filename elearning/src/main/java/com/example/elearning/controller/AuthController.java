package com.example.elearning.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.request.ForgotPasswordRequestDTO;
import com.example.elearning.dto.request.LoginRequestDTO;
import com.example.elearning.dto.request.RegisterRequestDTO;
import com.example.elearning.dto.request.ResetPasswordRequestDTO;
import com.example.elearning.dto.response.AuthResponseDTO;
import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.service.AuthService;
import com.example.elearning.service.UserProfileService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

	private final AuthService authService;
	private final UserProfileService userProfileService;

	public AuthController(AuthService authService, UserProfileService userProfileService) {
		this.authService = authService;
		this.userProfileService = userProfileService;
	}

	@PostMapping("/register")
	public UserResponseDTO register(@Valid @RequestBody RegisterRequestDTO dto) {
		return authService.register(dto);
	}

	@PostMapping("/login")
	public AuthResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {
		return authService.login(dto);
	}

	/**
	 * Forgot password - send reset email
	 * POST /api/auth/forgot-password
	 * Public endpoint
	 */
	@PostMapping("/forgot-password")
	public String forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO dto) {
		userProfileService.forgotPassword(dto);
		return "Password reset email sent";
	}

	/**
	 * Reset password with token
	 * POST /api/auth/reset-password
	 * Public endpoint
	 */
	@PostMapping("/reset-password")
	public String resetPassword(@Valid @RequestBody ResetPasswordRequestDTO dto) {
		userProfileService.resetPassword(dto);
		return "Password reset successfully";
	}

	/**
	 * Verify email with token
	 * GET /api/auth/verify-email/{token}
	 * Public endpoint
	 */
	@GetMapping("/verify-email/{token}")
	public String verifyEmail(@PathVariable String token) {
		return userProfileService.verifyEmail(token);
	}

}
