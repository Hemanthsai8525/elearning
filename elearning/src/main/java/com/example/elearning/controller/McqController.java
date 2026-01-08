package com.example.elearning.controller;

import com.example.elearning.dto.request.SubmitMcqDTO;
import com.example.elearning.dto.response.McqSubmissionResponseDTO;
import com.example.elearning.service.McqService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mcq")
public class McqController {
    private final McqService mcqService;

    public McqController(McqService mcqService) {
        this.mcqService = mcqService;
    }

    @PostMapping("/submit")
    @PreAuthorize("hasRole('STUDENT')")
    public McqSubmissionResponseDTO submitMcq(@Valid @RequestBody SubmitMcqDTO dto) {
        return mcqService.submitMcq(dto);
    }

    @GetMapping("/{taskId}/submission")
    @PreAuthorize("hasRole('STUDENT')")
    public McqSubmissionResponseDTO getSubmission(@PathVariable Long taskId) {
        return mcqService.getSubmission(taskId);
    }
}
