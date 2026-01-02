package com.example.elearning.listener;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import com.example.elearning.event.CourseEnrolledEvent;
import com.example.elearning.event.PaymentSuccessEvent;
import com.example.elearning.event.UserRegisteredEvent;
import com.example.elearning.model.User;
import com.example.elearning.service.EmailService;
@Component
public class EmailEventListener {
    private final EmailService emailService;
    public EmailEventListener(EmailService emailService) {
        this.emailService = emailService;
    }
    @EventListener
    public void onRegistration(UserRegisteredEvent event) {
        User user = event.user();
        emailService.send(
            user.getEmail(),
            "Welcome to E-Learning Platform",
            """
            Hi %s,
            Your account has been successfully created.
            You can now enroll in courses and start learning.
            Happy Learning!
            """.formatted(user.getName())
        );
    }
    @EventListener
    public void onEnrollment(CourseEnrolledEvent event) {
        emailService.send(
            event.student().getEmail(),
            "Enrollment Confirmed",
            """
            You have successfully enrolled in:
            %s
            Start learning now!
            """.formatted(event.course().getTitle())
        );
    }
    @EventListener
    public void onPayment(PaymentSuccessEvent event) {
        emailService.send(
            event.student().getEmail(),
            "Payment Successful",
            """
            Payment confirmed for course:
            %s
            Amount Paid: ₹%.2f
            You are now enrolled.
            """.formatted(
                event.course().getTitle(),
                event.amount()
            )
        );
    }
}
