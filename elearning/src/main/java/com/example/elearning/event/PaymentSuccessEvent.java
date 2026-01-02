package com.example.elearning.event;
import com.example.elearning.model.Course;
import com.example.elearning.model.User;
public record PaymentSuccessEvent(
        User student,
        Course course,
        Double amount
) {}
