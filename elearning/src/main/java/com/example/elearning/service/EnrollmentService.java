package com.example.elearning.service;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.elearning.dto.response.EnrollmentResponseDTO;
import com.example.elearning.event.CourseEnrolledEvent;
import com.example.elearning.model.Course;
import com.example.elearning.model.Enrollment;
import com.example.elearning.model.Role;
import com.example.elearning.model.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.PaymentRepository;
import com.example.elearning.repository.UserRepository;

@Service
public class EnrollmentService {

	private final EnrollmentRepository enrollRepo;
	private final CourseRepository courseRepo;
	private final UserRepository userRepo;
	private final PaymentRepository paymentRepo;
	private final ApplicationEventPublisher publisher;

	public EnrollmentService(EnrollmentRepository enrollRepo, CourseRepository courseRepo, UserRepository userRepo,
			PaymentRepository paymentRepo, ApplicationEventPublisher publisher) {
		this.enrollRepo = enrollRepo;
		this.courseRepo = courseRepo;
		this.userRepo = userRepo;
		this.paymentRepo = paymentRepo;
		this.publisher = publisher;
	}

// STUDENT only
	public EnrollmentResponseDTO enroll(Long courseId) {

		String email = SecurityContextHolder.getContext().getAuthentication().getName();

		User student = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		if (student.getRole() != Role.STUDENT) {
			throw new RuntimeException("Only students can enroll");
		}

		Course course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

		if (enrollRepo.existsByStudentIdAndCourseId(student.getId(), courseId)) {
			throw new RuntimeException("Already enrolled");
		}

		// 🔐 PAYMENT CHECK
		if (course.isPaid()) {
			paymentRepo.findByStudentIdAndCourseIdAndStatus(student.getId(), courseId, "SUCCESS")
					.orElseThrow(() -> new RuntimeException("Payment required to enroll"));
		}

		Enrollment enrollment = new Enrollment();
		enrollment.setStudent(student);
		enrollment.setCourse(course);

		Enrollment saved = enrollRepo.save(enrollment);
		publisher.publishEvent(new CourseEnrolledEvent(student, course));


		return new EnrollmentResponseDTO(course.getId(), course.getTitle(), saved.getEnrolledAt());
	}

// STUDENT – view own enrollments
	public List<EnrollmentResponseDTO> myEnrollments() {

		String email = SecurityContextHolder.getContext().getAuthentication().getName();

		User student = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return enrollRepo.findByStudentId(student.getId()).stream()
				.map(e -> new EnrollmentResponseDTO(e.getCourse().getId(), e.getCourse().getTitle(), e.getEnrolledAt()))
				.toList();
	}

}
