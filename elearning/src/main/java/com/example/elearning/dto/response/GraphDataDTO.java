package com.example.elearning.dto.response;

public class GraphDataDTO {
    private String name;
    private double value; // Can be revenue or count
    private long extraValue; // Optional, e.g., students count

    public GraphDataDTO(String name, double value) {
        this.name = name;
        this.value = value;
    }

    public GraphDataDTO(String name, double value, long extraValue) {
        this.name = name;
        this.value = value;
        this.extraValue = extraValue;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public long getExtraValue() {
        return extraValue;
    }

    public void setExtraValue(long extraValue) {
        this.extraValue = extraValue;
    }
}
