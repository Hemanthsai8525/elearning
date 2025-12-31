package com.example.elearning.service;

import java.util.List;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.elearning.dto.response.EnrolledStudentDTO;
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
import com.example.elearning.repository.LessonRepository;
import com.example.elearning.repository.LessonProgressRepository;

@Service
public class EnrollmentService {

	private final EnrollmentRepository enrollRepo;
	private final CourseRepository courseRepo;
	private final UserRepository userRepo;
	private final PaymentRepository paymentRepo;
	private final LessonRepository lessonRepo;
	private final LessonProgressRepository progressRepo;
	private final ApplicationEventPublisher publisher;

	public EnrollmentService(EnrollmentRepository enrollRepo, CourseRepository courseRepo, UserRepository userRepo,
			PaymentRepository paymentRepo, LessonRepository lessonRepo, LessonProgressRepository progressRepo,
			ApplicationEventPublisher publisher) {
		this.enrollRepo = enrollRepo;
		this.courseRepo = courseRepo;
		this.userRepo = userRepo;
		this.paymentRepo = paymentRepo;
		this.lessonRepo = lessonRepo;
		this.progressRepo = progressRepo;
		this.publisher = publisher;
	}

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

		if (course.isPaid()) {
			paymentRepo.findByStudentIdAndCourseIdAndStatus(student.getId(), courseId, "SUCCESS")
					.orElseThrow(() -> new RuntimeException("Payment required to enroll"));
		}

		Enrollment enrollment = new Enrollment();
		enrollment.setStudent(student);
		enrollment.setCourse(course);

		Enrollment saved = enrollRepo.save(enrollment);
		publisher.publishEvent(new CourseEnrolledEvent(student, course));

		return new EnrollmentResponseDTO(course.getId(), course.getTitle(), saved.getEnrolledAt(),
				course.getTeacher().getName(), 0);
	}

	public List<EnrollmentResponseDTO> myEnrollments() {

		String email = SecurityContextHolder.getContext().getAuthentication().getName();

		User student = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return enrollRepo.findByStudentId(student.getId()).stream().map(e -> {
			int total = lessonRepo.findByCourseIdOrderByLessonOrderAsc(e.getCourse().getId()).size();
			int completed = (int) progressRepo.countByEnrollmentId(e.getId());
			int percent = total == 0 ? 0 : (completed * 100) / total;

			return new EnrollmentResponseDTO(e.getCourse().getId(), e.getCourse().getTitle(), e.getEnrolledAt(),
					e.getCourse().getTeacher().getName(), percent);
		}).toList();
	}

	public List<EnrolledStudentDTO> getStudentsEnrolledInCourse(Long courseId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User teacher = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		Course course = courseRepo.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

		if (!course.getTeacher().getId().equals(teacher.getId())) {
			throw new RuntimeException("Not authorized to view enrollees for this course");
		}

		int totalLessons = lessonRepo.findByCourseIdOrderByLessonOrderAsc(courseId).size();

		return enrollRepo.findByCourseId(courseId).stream().map(e -> {
			int completed = (int) progressRepo.countByEnrollmentId(e.getId());
			int percent = totalLessons == 0 ? 0 : (completed * 100) / totalLessons;

			return new EnrolledStudentDTO(
					e.getStudent().getId(),
					e.getStudent().getName(),
					e.getStudent().getEmail(),
					e.getEnrolledAt(),
					percent);
		}).toList();
	}

	public boolean isEnrolled(Long courseId) {
		String email = SecurityContextHolder.getContext().getAuthentication().getName();
		User student = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		return enrollRepo.existsByStudentIdAndCourseId(student.getId(), courseId);
	}
}
