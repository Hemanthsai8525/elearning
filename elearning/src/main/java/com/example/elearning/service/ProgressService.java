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
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
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

                // Check if all lessons and tasks for current day are completed
                updateCurrentDayIfCompleted(enrollment, courseId);
        }

        private void updateCurrentDayIfCompleted(Enrollment enrollment, Long courseId) {
                Integer currentDay = enrollment.getCurrentDay() != null ? enrollment.getCurrentDay() : 1;

                // Get all lessons for current day
                java.util.List<Lesson> lessonsForDay = lessonRepo.findByCourseId(courseId).stream()
                                .filter(l -> {
                                        Integer d = l.getDayNumber() != null ? l.getDayNumber() : 1;
                                        return d.equals(currentDay);
                                })
                                .toList();

                // Get completed lesson IDs
                java.util.List<Long> completedLessonIds = progressRepo.findByEnrollmentId(enrollment.getId())
                                .stream()
                                .map(p -> p.getLesson().getId())
                                .toList();

                // Check if all lessons for current day are completed
                boolean allLessonsCompleted = lessonsForDay.stream()
                                .allMatch(l -> completedLessonIds.contains(l.getId()));

                if (allLessonsCompleted && !lessonsForDay.isEmpty()) {
                        // Advance to next day
                        enrollment.setCurrentDay(currentDay + 1);
                        enrollmentRepo.save(enrollment);
                }
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
                java.time.LocalDateTime enrolledAt = enrollment.getEnrolledAt() != null ? enrollment.getEnrolledAt()
                                : java.time.LocalDateTime.now();
                long days = java.time.temporal.ChronoUnit.DAYS.between(enrolledAt,
                                java.time.LocalDateTime.now()) + 1;
                return new ProgressResponseDTO(
                                courseId,
                                completed,
                                total,
                                percent,
                                completedIds,
                                enrollment.getCurrentDay(),
                                (int) days);
        }
}
