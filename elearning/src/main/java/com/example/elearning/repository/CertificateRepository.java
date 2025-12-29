package com.example.elearning.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.elearning.model.Certificate;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    Optional<Certificate> findByStudentIdAndCourseId(Long studentId, Long courseId);

    Optional<Certificate> findByCertificateCode(String certificateCode);

    List<Certificate> findByStudentId(Long studentId);

    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
}
