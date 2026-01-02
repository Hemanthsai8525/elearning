package com.example.elearning.service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.elearning.dto.response.ProgressResponseDTO;
import com.example.elearning.model.Enrollment;
import com.example.elearning.model.Lesson;
import com.example.elearning.model.LessonProgress;
import com.example.elearning.model.User;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.LessonProgressRepository;
import com.example.elearning.repository.LessonRepository;
import com.example.elearning.repository.UserRepository;
@Service
public class ProgressService {
        private final LessonProgressRepository progressRepo;
        private final EnrollmentRepository enrollmentRepo;
        private final LessonRepository lessonRepo;
        private final UserRepository userRepo;
        public ProgressService(LessonProgressRepository progressRepo,
                        EnrollmentRepository enrollmentRepo,
                        LessonRepository lessonRepo,
                        UserRepository userRepo) {
                this.progressRepo = progressRepo;
                this.enrollmentRepo = enrollmentRepo;
                this.lessonRepo = lessonRepo;
                this.userRepo = userRepo;
        }
        public void markLessonCompleted(Long courseId, Long lessonId) {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                User student = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
                Enrollment enrollment = enrollmentRepo
                                .findByStudentIdAndCourseId(student.getId(), courseId)
                                .orElseThrow(() -> new RuntimeException("Not enrolled in course"));
                if (progressRepo.existsByEnrollmentIdAndLessonId(enrollment.getId(), lessonId)) {
                        return;
                }
                Lesson lesson = lessonRepo.findById(lessonId)
                                .orElseThrow(() -> new RuntimeException("Lesson not found"));
                LessonProgress progress = new LessonProgress();
                progress.setEnrollment(enrollment);
                progress.setLesson(lesson);
                progressRepo.save(progress);
        }
        public ProgressResponseDTO getProgress(Long courseId) {
                String email = SecurityContextHolder.getContext()
                                .getAuthentication().getName();
                User student = userRepo.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Enrollment enrollment = enrollmentRepo
                                .findByStudentIdAndCourseId(student.getId(), courseId)
                                .orElseThrow(() -> new RuntimeException("Not enrolled in this course"));
                java.util.List<LessonProgress> progresses = progressRepo.findByEnrollmentId(enrollment.getId());
                int completed = progresses.size();
                java.util.List<Long> completedIds = progresses.stream()
                                .map(p -> p.getLesson().getId())
                                .toList();
                int total = lessonRepo.findByCourseId(courseId).size();
                int percent = total == 0 ? 0 : (completed * 100) / total;
                return new ProgressResponseDTO(
                                courseId,
                                completed,
                                total,
                                percent,
                                completedIds);
        }
}
