package com.example.elearning.controller;

import com.example.elearning.dto.request.ReviewTheorySubmissionDTO;
import com.example.elearning.dto.response.TheorySubmissionResponseDTO;
import com.example.elearning.service.TheoryService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/theory")
public class TheoryController {
    private final TheoryService theoryService;

    public TheoryController(TheoryService theoryService) {
        this.theoryService = theoryService;
    }

    @PostMapping("/{taskId}/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public TheorySubmissionResponseDTO submitTheory(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file) {
        return theoryService.submitTheory(taskId, file);
    }

    @GetMapping("/{taskId}/submission")
    @PreAuthorize("hasRole('STUDENT')")
    public TheorySubmissionResponseDTO getStudentSubmission(@PathVariable Long taskId) {
        return theoryService.getStudentSubmission(taskId);
    }

    @GetMapping("/task/{taskId}/submissions")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public List<TheorySubmissionResponseDTO> getAllSubmissions(@PathVariable Long taskId) {
        return theoryService.getAllSubmissions(taskId);
    }

    @PutMapping("/submission/{id}/review")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public TheorySubmissionResponseDTO reviewSubmission(
            @PathVariable Long id,
            @Valid @RequestBody ReviewTheorySubmissionDTO dto) {
        return theoryService.reviewSubmission(id, dto);
    }

    @GetMapping("/submission/{id}/download")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN') or hasRole('STUDENT')")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            Path filePath = theoryService.getSubmissionFile(id);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found or not readable");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file: " + e.getMessage());
        }
    }
}
