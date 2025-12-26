package com.example.elearning.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.elearning.service.FileUploadService;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    private final FileUploadService uploadService;

    public UploadController(FileUploadService uploadService) {
        this.uploadService = uploadService;
    }

    // TEACHER only
    @PostMapping("/video")
    public String uploadVideo(@RequestParam("file") MultipartFile file) {
        return uploadService.uploadVideo(file);
    }
}
