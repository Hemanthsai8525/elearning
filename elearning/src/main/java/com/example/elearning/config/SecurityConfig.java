package com.example.elearning.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.elearning.security.JwtAuthFilter;

@Configuration
public class SecurityConfig {

	private final JwtAuthFilter jwtFilter;

	public SecurityConfig(JwtAuthFilter jwtFilter) {
		this.jwtFilter = jwtFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.cors(cors -> cors.configure(http)) // Enable CORS
				.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth

						// 🔓 Public endpoints
						.requestMatchers("/api/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/courses").permitAll() // Browse courses publicly
						.requestMatchers("/api/courses/*/preview").permitAll() // Course preview for non-enrolled users
						.requestMatchers("/api/certificates/verify/**").permitAll() // Public certificate verification

						// 🔐 Admin only
						.requestMatchers("/api/admin/**").hasRole("ADMIN")

						// 🔐 Student only
						.requestMatchers("/api/progress/**").hasRole("STUDENT")
						.requestMatchers(HttpMethod.POST, "/api/enrollments/**").hasRole("STUDENT")
						.requestMatchers(HttpMethod.GET, "/api/enrollments/**").hasRole("STUDENT")
						.requestMatchers("/api/payments/**").hasRole("STUDENT")
						.requestMatchers("/api/certificates/generate/**").hasRole("STUDENT")
						.requestMatchers("/api/certificates/my").hasRole("STUDENT")

						// 🔐 Teacher only
						.requestMatchers(HttpMethod.POST, "/api/courses").hasRole("TEACHER")
						.requestMatchers(HttpMethod.POST, "/api/courses/*/lessons").hasRole("TEACHER")
						.requestMatchers("/api/upload/**").hasRole("TEACHER")

						// 🔐 Authenticated users
						.requestMatchers("/api/users/**").authenticated() // Profile management
						.requestMatchers(HttpMethod.GET, "/api/courses/*/lessons").authenticated()

						// 🔐 Everything else
						.anyRequest().authenticated())
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
