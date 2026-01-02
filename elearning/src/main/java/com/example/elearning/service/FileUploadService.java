package com.example.elearning.service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
@Service
public class FileUploadService {
    @Value("${file.upload-dir}")
    private String uploadDir;
    public String uploadVideo(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        if (file.getContentType() == null ||
            !file.getContentType().startsWith("video/")) {
            throw new RuntimeException("Only video files allowed");
        }
        try {
            String filename =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(uploadDir, filename);
            Files.copy(
                file.getInputStream(),
                path,
                StandardCopyOption.REPLACE_EXISTING
            );
            return "/videos/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload video", e);
        }
    }
}
