package com.example.elearning.mapper;

import com.example.elearning.dto.response.UserResponseDTO;
import com.example.elearning.model.User;

public class UserMapper {
	
	private UserMapper() {}

    public static UserResponseDTO toDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }

}
