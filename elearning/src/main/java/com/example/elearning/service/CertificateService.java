package com.example.elearning.service;

import java.util.List;
import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.elearning.dto.response.CertificateResponseDTO;
import com.example.elearning.model.Certificate;
import com.example.elearning.model.Course;
import com.example.elearning.model.Enrollment;
import com.example.elearning.model.User;
import com.example.elearning.repository.CertificateRepository;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.LessonProgressRepository;
import com.example.elearning.repository.LessonRepository;
import com.example.elearning.repository.UserRepository;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final LessonRepository lessonRepo;
    private final LessonProgressRepository progressRepo;
    private final UserRepository userRepo;
    private final CourseRepository courseRepo;

    public CertificateService(CertificateRepository certificateRepo,
            EnrollmentRepository enrollmentRepo,
            LessonRepository lessonRepo,
            LessonProgressRepository progressRepo,
            UserRepository userRepo,
            CourseRepository courseRepo) {
        this.certificateRepo = certificateRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.lessonRepo = lessonRepo;
        this.progressRepo = progressRepo;
        this.userRepo = userRepo;
        this.courseRepo = courseRepo;
    }

    /**
     * Generate certificate for a student who completed a course
     */
    public CertificateResponseDTO generateCertificate(Long courseId) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User student = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if already has certificate
        if (certificateRepo.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            throw new RuntimeException("Certificate already issued for this course");
        }

        // Verify enrollment
        Enrollment enrollment = enrollmentRepo
                .findByStudentIdAndCourseId(student.getId(), courseId)
                .orElseThrow(() -> new RuntimeException("Not enrolled in this course"));

        // Check completion
        int totalLessons = lessonRepo.findByCourseIdOrderByLessonOrderAsc(courseId).size();
        int completedLessons = (int) progressRepo.countByEnrollmentId(enrollment.getId());

        if (totalLessons == 0) {
            throw new RuntimeException("Course has no lessons");
        }

        int completionPercentage = (completedLessons * 100) / totalLessons;

        if (completionPercentage < 100) {
            throw new RuntimeException("Course not completed. Progress: " + completionPercentage + "%");
        }

        // Generate certificate
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Certificate certificate = new Certificate();
        certificate.setStudent(student);
        certificate.setCourse(course);
        certificate.setCertificateCode(generateUniqueCertificateCode());
        certificate.setCompletionPercentage(completionPercentage);

        Certificate saved = certificateRepo.save(certificate);

        return new CertificateResponseDTO(
                saved.getId(),
                student.getName(),
                course.getTitle(),
                saved.getCertificateCode(),
                saved.getIssuedAt(),
                saved.getCompletionPercentage());
    }

    /**
     * Get all certificates for the logged-in student
     */
    public List<CertificateResponseDTO> getMyCertificates() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        User student = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return certificateRepo.findByStudentId(student.getId())
                .stream()
                .map(cert -> new CertificateResponseDTO(
                        cert.getId(),
                        cert.getStudent().getName(),
                        cert.getCourse().getTitle(),
                        cert.getCertificateCode(),
                        cert.getIssuedAt(),
                        cert.getCompletionPercentage()))
                .toList();
    }

    /**
     * Verify a certificate by its code (public endpoint)
     */
    public CertificateResponseDTO verifyCertificate(String certificateCode) {
        Certificate certificate = certificateRepo.findByCertificateCode(certificateCode)
                .orElseThrow(() -> new RuntimeException("Invalid certificate code"));

        return new CertificateResponseDTO(
                certificate.getId(),
                certificate.getStudent().getName(),
                certificate.getCourse().getTitle(),
                certificate.getCertificateCode(),
                certificate.getIssuedAt(),
                certificate.getCompletionPercentage());
    }

    /**
     * Generate unique certificate code
     */
    private String generateUniqueCertificateCode() {
        String code;
        do {
            code = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (certificateRepo.findByCertificateCode(code).isPresent());
        return code;
    }
}
