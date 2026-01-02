package com.example.elearning.service;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.elearning.dto.request.ChangePasswordRequestDTO;
import com.example.elearning.dto.request.ForgotPasswordRequestDTO;
import com.example.elearning.dto.request.ResetPasswordRequestDTO;
import com.example.elearning.dto.request.UpdateProfileRequestDTO;
import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.mapper.UserMapper;
import com.example.elearning.model.User;
import com.example.elearning.repository.UserRepository;
@Service
public class UserProfileService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    public UserProfileService(UserRepository userRepo,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }
    public UserResponseDTO getMyProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toDTO(user);
    }
    public UserResponseDTO updateProfile(UpdateProfileRequestDTO dto) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getEmail().equals(dto.getEmail())) {
            if (userRepo.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(dto.getEmail());
            user.setEmailVerified(false);
            sendEmailVerification(user);
        }
        user.setName(dto.getName());
        User updated = userRepo.save(user);
        return UserMapper.toDTO(updated);
    }
    public void changePassword(ChangePasswordRequestDTO dto) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepo.save(user);
    }
    public void sendEmailVerification(User user) {
        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepo.save(user);
        String verificationLink = "http:
        String message = "Click the link to verify your email: " + verificationLink;
        emailService.send(user.getEmail(), "Email Verification", message);
    }
    public String verifyEmail(String token) {
        User user = userRepo.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));
        if (user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token expired");
        }
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setEmailVerificationTokenExpiry(null);
        userRepo.save(user);
        return "Email verified successfully";
    }
    public void forgotPassword(ForgotPasswordRequestDTO dto) {
        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepo.save(user);
        String resetLink = "http:
        String message = "Click the link to reset your password (expires in 1 hour): " + resetLink;
        emailService.send(user.getEmail(), "Password Reset", message);
    }
    public void resetPassword(ResetPasswordRequestDTO dto) {
        User user = userRepo.findByPasswordResetToken(dto.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));
        if (user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepo.save(user);
    }
    public void resendEmailVerification() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.isEmailVerified()) {
            throw new RuntimeException("Email already verified");
        }
        sendEmailVerification(user);
    }
}
