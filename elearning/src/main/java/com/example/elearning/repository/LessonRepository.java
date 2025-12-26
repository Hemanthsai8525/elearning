package com.example.elearning.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.elearning.model.Lesson;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByCourseIdOrderByLessonOrderAsc(Long courseId);
}
