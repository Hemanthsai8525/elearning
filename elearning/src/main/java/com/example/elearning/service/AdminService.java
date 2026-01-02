package com.example.elearning.service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.elearning.dto.request.CreateTeacherRequestDTO;
import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.mapper.UserMapper;
import com.example.elearning.model.Role;
import com.example.elearning.model.User;
import com.example.elearning.repository.UserRepository;
@Service
public class AdminService {
	 private final UserRepository repo;
	    private final PasswordEncoder encoder;
	    public AdminService(UserRepository repo, PasswordEncoder encoder) {
	        this.repo = repo;
	        this.encoder = encoder;
	    }
	    public UserResponseDTO createTeacher(CreateTeacherRequestDTO dto) {
	        if (repo.existsByEmail(dto.getEmail())) {
	            throw new RuntimeException("Email already exists");
	        }
	        User teacher = new User();
	        teacher.setName(dto.getName());
	        teacher.setEmail(dto.getEmail());
	        teacher.setPassword(encoder.encode(dto.getPassword()));
	        teacher.setRole(Role.TEACHER);
	        teacher.setApproved(true);
	        return UserMapper.toDTO(repo.save(teacher));
	    }
}
