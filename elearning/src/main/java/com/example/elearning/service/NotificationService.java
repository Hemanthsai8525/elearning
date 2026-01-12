package com.example.elearning.service;

import com.example.elearning.model.Notification;
import com.example.elearning.model.User;
import com.example.elearning.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public void notify(User user, String message, String type, Long relatedEntityId) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(message);
        n.setType(type);
        n.setRelatedEntityId(relatedEntityId);
        repo.save(n);
    }

    public List<Notification> getUserNotifications(User user) {
        return repo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public void markAsRead(Long id) {
        repo.findById(id).ifPresent(n -> {
            n.setRead(true);
            repo.save(n);
        });
    }
}
