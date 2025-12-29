package com.example.elearning.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.elearning.model.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByCourseIdOrderByLessonOrderAsc(Long courseId);

    // For course preview - using lessonOrder field (mapped to orderIndex in DTO)
    default List<Lesson> findByCourseIdOrderByOrderIndexAsc(Long courseId) {
        return findByCourseIdOrderByLessonOrderAsc(courseId);
    }
}
