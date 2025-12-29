package com.example.elearning.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CreateCourseRequestDTO {
	@NotBlank
	private String title;
	
	@NotBlank
	private String description;
	
	private boolean paid;
    private Double price;
    
    

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isPaid() {
		return paid;
	}

	public void setPaid(boolean paid) {
		this.paid = paid;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}
	
	

}
