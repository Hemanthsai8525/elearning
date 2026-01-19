package com.example.elearning.dto.response;

public class AdminAnalyticsDTO {
    private double totalRevenue;
    private long totalStudents;
    private long activeCourses;
    private long totalEnrollments;
    private java.util.List<GraphDataDTO> revenueData;
    private java.util.List<GraphDataDTO> courseDistribution;

    public AdminAnalyticsDTO(double totalRevenue, long totalStudents, long activeCourses, long totalEnrollments,
            java.util.List<GraphDataDTO> revenueData, java.util.List<GraphDataDTO> courseDistribution) {
        this.totalRevenue = totalRevenue;
        this.totalStudents = totalStudents;
        this.activeCourses = activeCourses;
        this.totalEnrollments = totalEnrollments;
        this.revenueData = revenueData;
        this.courseDistribution = courseDistribution;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getActiveCourses() {
        return activeCourses;
    }

    public void setActiveCourses(long activeCourses) {
        this.activeCourses = activeCourses;
    }

    public long getTotalEnrollments() {
        return totalEnrollments;
    }

    public void setTotalEnrollments(long totalEnrollments) {
        this.totalEnrollments = totalEnrollments;
    }

    public java.util.List<GraphDataDTO> getRevenueData() {
        return revenueData;
    }

    public void setRevenueData(java.util.List<GraphDataDTO> revenueData) {
        this.revenueData = revenueData;
    }

    public java.util.List<GraphDataDTO> getCourseDistribution() {
        return courseDistribution;
    }

    public void setCourseDistribution(java.util.List<GraphDataDTO> courseDistribution) {
        this.courseDistribution = courseDistribution;
    }
}
