package com.example.elearning.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.elearning.model.User;
public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);
	boolean existsByEmail(String email);
	Optional<User> findByEmailVerificationToken(String token);
	Optional<User> findByPasswordResetToken(String token);
	java.util.List<User> findByRole(com.example.elearning.model.Role role);
}
