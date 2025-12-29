package com.example.elearning.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.request.ChangePasswordRequestDTO;
import com.example.elearning.dto.request.UpdateProfileRequestDTO;
import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.service.UserProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    /**
     * Get current user's profile
     * GET /api/users/profile
     * Requires: Authentication
     */
    @GetMapping("/profile")
    public UserResponseDTO getProfile() {
        return userProfileService.getMyProfile();
    }

    /**
     * Update current user's profile
     * PUT /api/users/profile
     * Requires: Authentication
     */
    @PutMapping("/profile")
    public UserResponseDTO updateProfile(@Valid @RequestBody UpdateProfileRequestDTO dto) {
        return userProfileService.updateProfile(dto);
    }

    /**
     * Change password
     * PUT /api/users/change-password
     * Requires: Authentication
     */
    @PutMapping("/change-password")
    public String changePassword(@Valid @RequestBody ChangePasswordRequestDTO dto) {
        userProfileService.changePassword(dto);
        return "Password changed successfully";
    }

    /**
     * Resend email verification
     * POST /api/users/resend-verification
     * Requires: Authentication
     */
    @GetMapping("/resend-verification")
    public String resendVerification() {
        userProfileService.resendEmailVerification();
        return "Verification email sent";
    }
}
