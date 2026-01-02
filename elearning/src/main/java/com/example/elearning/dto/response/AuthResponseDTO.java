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
	public AuthResponseDTO(String token, UserResponseDTO user) {
		super();
		this.token = token;
		this.user = user;
	}
}
