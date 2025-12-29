package com.example.elearning.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.elearning.dto.response.CertificateResponseDTO;
import com.example.elearning.service.CertificateService;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    /**
     * Generate certificate for completed course
     * POST /api/certificates/generate/{courseId}
     * Requires: STUDENT role, 100% course completion
     */
    @PostMapping("/generate/{courseId}")
    public CertificateResponseDTO generateCertificate(@PathVariable Long courseId) {
        return certificateService.generateCertificate(courseId);
    }

    /**
     * Get all certificates for logged-in student
     * GET /api/certificates/my
     * Requires: STUDENT role
     */
    @GetMapping("/my")
    public List<CertificateResponseDTO> getMyCertificates() {
        return certificateService.getMyCertificates();
    }

    /**
     * Verify certificate by code (public endpoint)
     * GET /api/certificates/verify/{code}
     * No authentication required
     */
    @GetMapping("/verify/{code}")
    public CertificateResponseDTO verifyCertificate(@PathVariable String code) {
        return certificateService.verifyCertificate(code);
    }
}
