package com.example.elearning.dto.response;

import java.time.LocalDateTime;

public class AdminUserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime joinedDate;
    private long courseCount;
    private double revenue;
    private boolean enabled;

    public AdminUserResponseDTO(Long id, String name, String email, String role, LocalDateTime joinedDate,
            long courseCount, double revenue, boolean enabled) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.joinedDate = joinedDate;
        this.courseCount = courseCount;
        this.revenue = revenue;
        this.enabled = enabled;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(LocalDateTime joinedDate) {
        this.joinedDate = joinedDate;
    }

    public long getCourseCount() {
        return courseCount;
    }

    public void setCourseCount(long courseCount) {
        this.courseCount = courseCount;
    }

    public double getRevenue() {
        return revenue;
    }

    public void setRevenue(double revenue) {
        this.revenue = revenue;
    }
}
