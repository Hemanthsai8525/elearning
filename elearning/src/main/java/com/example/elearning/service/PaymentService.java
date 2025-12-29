package com.example.elearning.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.elearning.event.PaymentSuccessEvent;
import com.example.elearning.model.Course;
import com.example.elearning.model.Payment;
import com.example.elearning.model.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.PaymentRepository;
import com.example.elearning.repository.UserRepository;

@Service
public class PaymentService {

	private final PaymentRepository paymentRepo;
	private final CourseRepository courseRepo;
	private final UserRepository userRepo;
	private final ApplicationEventPublisher publisher;

	public PaymentService(PaymentRepository paymentRepo, CourseRepository courseRepo, UserRepository userRepo,
			ApplicationEventPublisher publisher) {
		this.paymentRepo = paymentRepo;
		this.courseRepo = courseRepo;
		this.userRepo = userRepo;
		this.publisher = publisher;
	}

	public void simulatePayment(Long courseId) {

		String email = SecurityContextHolder.getContext().getAuthentication().getName();

		User student = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Course course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

		if (!course.isPaid()) {
			throw new RuntimeException("Course is free");
		}

		Payment payment = new Payment();
		payment.setStudent(student);
		payment.setCourse(course);
		payment.setAmount(course.getPrice());
		payment.setStatus("SUCCESS");
		payment.setProvider("SIMULATED");

		paymentRepo.save(payment);
		publisher.publishEvent(
		    new PaymentSuccessEvent(student, course, course.getPrice())
		);

	}
}
