package com.example.elearning.config;

import com.example.elearning.model.Course;
import com.example.elearning.model.Lesson;
import com.example.elearning.model.Role;
import com.example.elearning.model.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.LessonRepository;
import com.example.elearning.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepo;
    private final CourseRepository courseRepo;
    private final LessonRepository lessonRepo;
    private final PasswordEncoder encoder;

    public DataSeeder(UserRepository userRepo, CourseRepository courseRepo, LessonRepository lessonRepo,
            PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.courseRepo = courseRepo;
        this.lessonRepo = lessonRepo;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepo.existsByEmail("teacher@example.com")) {
            User teacher = new User();
            teacher.setName("John Instructor");
            teacher.setEmail("teacher@example.com");
            teacher.setPassword(encoder.encode("teacher123"));
            teacher.setRole(Role.TEACHER);
            teacher.setApproved(true);
            userRepo.save(teacher);
            System.out.println("✅ Seeded Teacher: teacher@example.com / teacher123");
        }
        if (!userRepo.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setName("Super Admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(encoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setApproved(true);
            userRepo.save(admin);
            System.out.println("✅ Seeded Admin: admin@example.com / admin123");
        }
        if (!userRepo.existsByEmail("student@example.com")) {
            User student = new User();
            student.setName("Alice Student");
            student.setEmail("student@example.com");
            student.setPassword(encoder.encode("student123"));
            student.setRole(Role.STUDENT);
            student.setApproved(true);
            userRepo.save(student);
            System.out.println("✅ Seeded Student: student@example.com / student123");
        }
        User teacher = userRepo.findByEmail("teacher@example.com").orElseThrow();
        Course course;
        if (courseRepo.findByTeacherId(teacher.getId()).isEmpty()) {
            course = new Course();
            course.setTitle("Complete React 2025");
            course.setDescription("Master React with modern hooks and patterns.");
            course.setPaid(false);
            course.setPrice(0.0);
            course.setTeacher(teacher);
            course.setPublished(true);
            course.setCreatedAt(LocalDateTime.now());
            course = courseRepo.save(course);
            System.out.println("✅ Seeded Course: Complete React 2025");
        } else {
            course = courseRepo.findByTeacherId(teacher.getId()).get(0);
        }
        if (lessonRepo.findByCourseId(course.getId()).isEmpty()) {
            Lesson lesson1 = new Lesson();
            lesson1.setTitle("Introduction to React");
            lesson1.setVideoUrl("https://www.youtube.com/watch?v=SqcY0GlETPk");
            lesson1.setLessonOrder(1);
            lesson1.setCourse(course);
            lessonRepo.save(lesson1);
            Lesson lesson2 = new Lesson();
            lesson2.setTitle("Components & Props");
            lesson2.setVideoUrl("https://www.youtube.com/watch?v=SqcY0GlETPk");
            lesson2.setLessonOrder(2);
            lesson2.setCourse(course);
            lessonRepo.save(lesson2);
            System.out.println("✅ Seeded 2 Lessons.");
        }

        // Fix for Lesson 94 video URL
        lessonRepo.findById(94L).ifPresent(lesson -> {
            lesson.setVideoUrl("https://www.youtube.com/watch?v=inWWhr5tnEA");
            lessonRepo.save(lesson);
            System.out.println("✅ Updated Lesson 94 video URL.");
        });
    }
}
