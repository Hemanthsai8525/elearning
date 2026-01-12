package com.example.elearning.controller;

import com.example.elearning.model.Notification;
import com.example.elearning.model.User;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.service.NotificationService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;
    private final UserRepository userRepo;

    public NotificationController(NotificationService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    @GetMapping
    public List<Notification> getMyNotifications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return service.getUserNotifications(user);
    }

    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
    }
}
