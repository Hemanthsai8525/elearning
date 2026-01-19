package com.example.elearning.dto.response;

public class AuthResponseDTO {
	private String token;
	private UserResponseDTO user;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public UserResponseDTO getUser() {
		return user;
	}

	public void setUser(UserResponseDTO user) {
		this.user = user;
	}

	private boolean passwordChangeRequired;

	public boolean isPasswordChangeRequired() {
		return passwordChangeRequired;
	}

	public void setPasswordChangeRequired(boolean passwordChangeRequired) {
		this.passwordChangeRequired = passwordChangeRequired;
	}

	public AuthResponseDTO(String token, UserResponseDTO user, boolean passwordChangeRequired) {
		super();
		this.token = token;
		this.user = user;
		this.passwordChangeRequired = passwordChangeRequired;
	}

	public AuthResponseDTO(String token, UserResponseDTO user) {
		this(token, user, false);
	}
}
