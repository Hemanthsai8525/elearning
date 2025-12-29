package com.example.elearning.service;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.elearning.config.JwtService;
import com.example.elearning.dto.request.LoginRequestDTO;
import com.example.elearning.dto.request.RegisterRequestDTO;
import com.example.elearning.dto.response.AuthResponseDTO;
import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.event.UserRegisteredEvent;
import com.example.elearning.mapper.UserMapper;
import com.example.elearning.model.Role;
import com.example.elearning.model.User;
import com.example.elearning.repository.UserRepository;

@Service
public class AuthService {

	private final UserRepository repo;
	private final PasswordEncoder encoder;
	private final JwtService jwtService;
	private final ApplicationEventPublisher publisher;

	public AuthService(UserRepository repo, PasswordEncoder encoder, JwtService jwtService,
			ApplicationEventPublisher publisher) {
		this.repo = repo;
		this.encoder = encoder;
		this.jwtService = jwtService;
		this.publisher = publisher;
	}

	public UserResponseDTO register(RegisterRequestDTO dto) {

		if (repo.existsByEmail(dto.getEmail())) {
			throw new RuntimeException("Email already exists");
		}

		User user = new User();
		user.setName(dto.getName());
		user.setEmail(dto.getEmail());
		user.setPassword(encoder.encode(dto.getPassword()));
		user.setRole(Role.STUDENT);
		user.setApproved(true);
		User savedUser = repo.save(user);
		publisher.publishEvent(new UserRegisteredEvent(savedUser));
		return UserMapper.toDTO(savedUser);

	}

	public AuthResponseDTO login(LoginRequestDTO dto) {

		User user = repo.findByEmail(dto.getEmail()).orElseThrow(() -> new RuntimeException("Invalid credentials"));

		if (!encoder.matches(dto.getPassword(), user.getPassword())) {
			throw new RuntimeException("Invalid credentials");
		}

		String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

		return new AuthResponseDTO(token, UserMapper.toDTO(user));
	}

}
