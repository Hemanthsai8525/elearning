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

    @GetMapping("/profile")
    public UserResponseDTO getProfile() {
        return userProfileService.getMyProfile();
    }

    @PutMapping("/profile")
    public UserResponseDTO updateProfile(@Valid @RequestBody UpdateProfileRequestDTO dto) {
        return userProfileService.updateProfile(dto);
    }

    @PutMapping("/change-password")
    public String changePassword(@Valid @RequestBody ChangePasswordRequestDTO dto) {
        userProfileService.changePassword(dto);
        return "Password changed successfully";
    }

    @PutMapping("/force-change-password")
    public String forceChangePassword(@RequestBody java.util.Map<String, String> payload) {
        String newPassword = payload.get("newPassword");
        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
        userProfileService.forceChangePassword(newPassword);
        return "Password updated successfully";
    }

    @GetMapping("/resend-verification")
    public String resendVerification() {
        userProfileService.resendEmailVerification();
        return "Verification email sent";
    }
}
