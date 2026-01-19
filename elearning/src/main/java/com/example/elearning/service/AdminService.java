package com.example.elearning.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.elearning.dto.request.CreateTeacherRequestDTO;
import com.example.elearning.dto.response.AdminAnalyticsDTO;
import com.example.elearning.dto.response.AdminUserResponseDTO;
import com.example.elearning.dto.response.GraphDataDTO;
import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.mapper.UserMapper;
import com.example.elearning.model.Course;
import com.example.elearning.model.Payment;
import com.example.elearning.model.Role;
import com.example.elearning.model.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.PaymentRepository;
import com.example.elearning.repository.UserRepository;

@Service
public class AdminService {
	private final UserRepository userRepo;
	private final CourseRepository courseRepo;
	private final PaymentRepository paymentRepo;
	private final EnrollmentRepository enrollmentRepo;
	private final PasswordEncoder encoder;

	public AdminService(UserRepository userRepo, CourseRepository courseRepo, PaymentRepository paymentRepo,
			EnrollmentRepository enrollmentRepo, PasswordEncoder encoder) {
		this.userRepo = userRepo;
		this.courseRepo = courseRepo;
		this.paymentRepo = paymentRepo;
		this.enrollmentRepo = enrollmentRepo;
		this.encoder = encoder;
	}

	public UserResponseDTO createTeacher(CreateTeacherRequestDTO dto) {
		if (userRepo.existsByEmail(dto.getEmail())) {
			throw new RuntimeException("Email already exists");
		}
		User teacher = new User();
		teacher.setName(dto.getName());
		teacher.setEmail(dto.getEmail());
		teacher.setPassword(encoder.encode(dto.getPassword()));
		teacher.setRole(Role.TEACHER);
		teacher.setApproved(true);
		teacher.setPasswordChangeRequired(true);
		return UserMapper.toDTO(userRepo.save(teacher));
	}

	public void deleteUser(Long id) {
		userRepo.deleteById(id);
	}

	public void updateUserRole(Long id, String roleName) {
		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
		user.setRole(Role.valueOf(roleName));
		userRepo.save(user);
	}

	public void toggleUserBlockStatus(Long id) {
		User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
		user.setEnabled(!user.isEnabled());
		userRepo.save(user);
	}

	public List<AdminUserResponseDTO> getAllUsers() {
		return userRepo.findAll().stream().map(user -> {
			long courseCount = 0;
			double revenue = 0.0;

			if (user.getRole() == Role.TEACHER) {
				try {
					var courses = courseRepo.findByTeacherId(user.getId());
					if (courses != null) {
						courseCount = courses.size();
					}
					var payments = paymentRepo.findByCourseTeacherIdAndStatus(user.getId(), "SUCCESS");
					if (payments != null) {
						revenue = payments.stream().mapToDouble(Payment::getAmount).sum();
					}
				} catch (Exception e) {
				}
			}

			return new AdminUserResponseDTO(
					user.getId(),
					user.getName(),
					user.getEmail(),
					user.getRole().name(),
					user.getCreatedAt(),
					courseCount,
					revenue,
					user.isEnabled());
		}).collect(Collectors.toList());
	}

	public AdminAnalyticsDTO getAnalytics() {
		// Basic Stats
		double totalRevenue = 0;
		List<Payment> payments = new ArrayList<>();
		try {
			payments = paymentRepo.findByStatus("SUCCESS");
			if (payments != null) {
				totalRevenue = payments.stream().mapToDouble(Payment::getAmount).sum();
			} else {
				payments = new ArrayList<>();
			}
		} catch (Exception e) {
		}

		long totalStudents = 0;
		try {
			var students = userRepo.findByRole(Role.STUDENT);
			if (students != null)
				totalStudents = students.size();
		} catch (Exception e) {
		}

		long activeCourses = courseRepo.count();
		long totalEnrollments = enrollmentRepo.count();

		// Revenue Graph Data (Last 7 Days)
		List<GraphDataDTO> revenueData = new ArrayList<>();
		LocalDate today = LocalDate.now();
		Map<String, Double> dailyRevenue = payments.stream()
				.filter(p -> p.getCreatedAt().toLocalDate().isAfter(today.minusDays(7)))
				.collect(Collectors.groupingBy(
						p -> p.getCreatedAt().toLocalDate().format(DateTimeFormatter.ofPattern("EEE")),
						Collectors.summingDouble(Payment::getAmount)));

		// Ensure ordering
		for (int i = 6; i >= 0; i--) {
			LocalDate date = today.minusDays(i);
			String dayLabel = date.format(DateTimeFormatter.ofPattern("EEE"));
			revenueData.add(new GraphDataDTO(dayLabel, dailyRevenue.getOrDefault(dayLabel, 0.0)));
		}

		// Course Distribution (Paid vs Free)
		List<GraphDataDTO> courseDistribution = new ArrayList<>();
		List<Course> allCourses = courseRepo.findAll();
		long paidCount = allCourses.stream().filter(Course::isPaid).count();
		long freeCount = allCourses.size() - paidCount;
		courseDistribution.add(new GraphDataDTO("Paid Courses", paidCount));
		courseDistribution.add(new GraphDataDTO("Free Courses", freeCount));

		// Create DTO with all data
		return new AdminAnalyticsDTO(totalRevenue, totalStudents, activeCourses, totalEnrollments, revenueData,
				courseDistribution);
	}
}
