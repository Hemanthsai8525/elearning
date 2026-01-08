package com.example.elearning.service;

import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.example.elearning.dto.request.CreateCourseRequestDTO;
import com.example.elearning.dto.response.CourseResponseDTO;
import com.example.elearning.model.Course;
import com.example.elearning.model.Role;
import com.example.elearning.model.User;
import com.example.elearning.repository.CourseRepository;
import com.example.elearning.repository.UserRepository;
import com.example.elearning.repository.LessonRepository;
import com.example.elearning.repository.EnrollmentRepository;
import com.example.elearning.repository.TaskRepository;
import com.example.elearning.model.Lesson;
import com.example.elearning.model.Task;
import com.example.elearning.model.TestCase;
import org.springframework.web.multipart.MultipartFile;
import jakarta.transaction.Transactional;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.ArrayList;

@Service
public class CourseService {
    private final CourseRepository courseRepo;
    private final UserRepository userRepo;
    private final EmailService emailService;
    private final LessonRepository lessonRepo;
    private final EnrollmentRepository enrollmentRepo;
    private final TaskRepository taskRepo;

    public CourseService(CourseRepository courseRepo, UserRepository userRepo, EmailService emailService,
            LessonRepository lessonRepo, EnrollmentRepository enrollmentRepo, TaskRepository taskRepo) {
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.lessonRepo = lessonRepo;
        this.enrollmentRepo = enrollmentRepo;
        this.taskRepo = taskRepo;
    }

    public CourseResponseDTO createCourse(CreateCourseRequestDTO dto) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User teacher = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (teacher.getRole() != Role.TEACHER) {
            throw new RuntimeException("Only teachers can create courses");
        }
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setPaid(dto.isPaid());
        course.setPrice(dto.isPaid() ? dto.getPrice() : 0.0);
        course.setTeacher(teacher);
        course.setPublished(false);
        Course saved = courseRepo.save(course);
        return mapToDTO(saved);
    }

    public CourseResponseDTO updateCourse(Long courseId, CreateCourseRequestDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (user.getRole() != Role.ADMIN &&
                !(user.getRole() == Role.TEACHER && course.getTeacher().getId().equals(user.getId()))) {
            throw new RuntimeException("Not authorized to update this course");
        }

        boolean wasPublished = course.isPublished();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setPaid(dto.isPaid());
        course.setPrice(dto.isPaid() ? dto.getPrice() : 0.0);

        // Only allow publishing, not unpublishing (or maybe allow both? let's allow
        // both)
        boolean isNowPublished = dto.isPublished();
        course.setPublished(isNowPublished);

        Course saved = courseRepo.save(course);

        // Send emails if course is newly published
        if (!wasPublished && isNowPublished) {
            new Thread(() -> {
                try {
                    List<User> students = userRepo.findByRole(Role.STUDENT);
                    String subject = "New Course Alert: " + saved.getTitle();
                    String bodyTemplate = "Hello %s,\n\nA new course '%s' has been published by %s.\n\nDescription: %s\n\nCheck it out on the platform!";
                    for (User student : students) {
                        try {
                            String body = String.format(bodyTemplate, student.getName(), saved.getTitle(),
                                    course.getTeacher().getName(), saved.getDescription());
                            emailService.send(student.getEmail(), subject, body);
                        } catch (Exception e) {
                            System.err.println("Failed to send email to " + student.getEmail());
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
        }

        return mapToDTO(saved);
    }

    public void deleteCourse(Long courseId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        if (user.getRole() == Role.ADMIN ||
                (user.getRole() == Role.TEACHER && course.getTeacher().getId().equals(user.getId()))) {
            courseRepo.delete(course);
        } else {
            throw new RuntimeException("Not authorized to delete this course");
        }
    }

    public List<CourseResponseDTO> getAllCourses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email == null || email.equals("anonymousUser")) {
            return courseRepo.findByPublishedTrue().stream()
                    .map(this::mapToDTO)
                    .toList();
        }
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Course> courses;
        if (user.getRole() == Role.TEACHER) {
            courses = courseRepo.findByTeacherId(user.getId());
        } else {
            courses = courseRepo.findByPublishedTrue();
        }
        return courses.stream()
                .map(this::mapToDTO)
                .toList();
    }

    private CourseResponseDTO mapToDTO(Course c) {
        return new CourseResponseDTO(
                c.getId(),
                c.getTitle(),
                c.getDescription(),
                c.isPaid(),
                c.getPrice(),
                c.getTeacher().getName(),
                lessonRepo.countByCourseId(c.getId()),
                enrollmentRepo.countByCourseId(c.getId()),
                c.isPublished());
    }

    @Transactional
    public CourseResponseDTO importCourse(MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (teacher.getRole() != Role.TEACHER && teacher.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only teachers can import courses");
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            Course course = new Course();
            course.setTeacher(teacher);
            course.setPublished(false); // Default to draft

            List<Lesson> lessons = new ArrayList<>();
            List<Task> tasks = new ArrayList<>();

            String currentSection = "";
            Lesson currentLesson = null;
            Task currentTask = null;
            com.example.elearning.model.McqQuestion currentMcqQuestion = null;

            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty())
                    continue;

                if (line.equalsIgnoreCase("[COURSE]")) {
                    currentSection = "COURSE";
                    continue;
                } else if (line.equalsIgnoreCase("[LESSON]")) {
                    currentSection = "LESSON";
                    currentLesson = new Lesson();
                    lessons.add(currentLesson);
                    continue;
                } else if (line.equalsIgnoreCase("[TASK]")) {
                    currentSection = "TASK";
                    currentTask = new Task();
                    currentTask.setTaskType(com.example.elearning.model.TaskType.CODING); // Default
                    tasks.add(currentTask);
                    currentMcqQuestion = null;
                    continue;
                }

                if (currentSection.equals("COURSE")) {
                    if (line.startsWith("Title:"))
                        course.setTitle(line.substring(6).trim());
                    else if (line.startsWith("Description:"))
                        course.setDescription(line.substring(12).trim());
                    else if (line.startsWith("Paid:"))
                        course.setPaid(Boolean.parseBoolean(line.substring(5).trim()));
                    else if (line.startsWith("Price:"))
                        course.setPrice(Double.parseDouble(line.substring(6).trim()));
                    else if (line.startsWith("Published:"))
                        course.setPublished(Boolean.parseBoolean(line.substring(10).trim()));
                } else if (currentSection.equals("LESSON") && currentLesson != null) {
                    if (line.startsWith("Title:"))
                        currentLesson.setTitle(line.substring(6).trim());
                    else if (line.startsWith("VideoUrl:"))
                        currentLesson.setVideoUrl(line.substring(9).trim());
                    else if (line.startsWith("Order:"))
                        currentLesson.setLessonOrder(Integer.parseInt(line.substring(6).trim()));
                    else if (line.startsWith("Day:"))
                        currentLesson.setDayNumber(Integer.parseInt(line.substring(4).trim()));
                } else if (currentSection.equals("TASK") && currentTask != null) {
                    if (line.startsWith("Type:")) {
                        String type = line.substring(5).trim().toUpperCase();
                        currentTask.setTaskType(com.example.elearning.model.TaskType.valueOf(type));
                    } else if (line.startsWith("Title:")) {
                        currentTask.setTitle(line.substring(6).trim());
                    } else if (line.startsWith("Description:")) {
                        currentTask.setDescription(line.substring(12).trim());
                    } else if (line.startsWith("StarterCode:")) {
                        currentTask.setStarterCode(line.substring(12).trim());
                    } else if (line.startsWith("Day:")) {
                        currentTask.setDayNumber(Integer.parseInt(line.substring(4).trim()));
                    } else if (line.startsWith("TestCase:")) {
                        String[] parts = line.substring(9).split("\\|");
                        if (parts.length == 2) {
                            TestCase tc = new TestCase();
                            tc.setInput(parts[0].trim());
                            tc.setExpectedOutput(parts[1].trim());
                            tc.setTask(currentTask);
                            currentTask.getTestCases().add(tc);
                        }
                    } else if (line.startsWith("Question:")) {
                        // New MCQ question
                        currentMcqQuestion = new com.example.elearning.model.McqQuestion();
                        currentMcqQuestion.setQuestion(line.substring(9).trim());
                        currentMcqQuestion.setTask(currentTask);
                        currentMcqQuestion.setQuestionOrder(currentTask.getMcqQuestions().size() + 1);
                        currentTask.getMcqQuestions().add(currentMcqQuestion);
                    } else if (currentMcqQuestion != null) {
                        if (line.startsWith("OptionA:")) {
                            currentMcqQuestion.setOptionA(line.substring(8).trim());
                        } else if (line.startsWith("OptionB:")) {
                            currentMcqQuestion.setOptionB(line.substring(8).trim());
                        } else if (line.startsWith("OptionC:")) {
                            currentMcqQuestion.setOptionC(line.substring(8).trim());
                        } else if (line.startsWith("OptionD:")) {
                            currentMcqQuestion.setOptionD(line.substring(8).trim());
                        } else if (line.startsWith("CorrectAnswer:")) {
                            currentMcqQuestion.setCorrectAnswer(line.substring(14).trim().toUpperCase());
                        }
                    }
                }
            }

            // Save everything
            Course savedCourse = courseRepo.save(course);

            for (Lesson l : lessons) {
                l.setCourse(savedCourse);
                lessonRepo.save(l);
            }

            for (Task t : tasks) {
                t.setCourse(savedCourse);
                taskRepo.save(t);
            }

            return mapToDTO(savedCourse);

        } catch (IOException e) {
            throw new RuntimeException("Failed to process file: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Error importing course: " + e.getMessage());
        }
    }
}
