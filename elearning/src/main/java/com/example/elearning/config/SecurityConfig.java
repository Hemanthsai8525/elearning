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
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.http.HttpStatus;
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
		http.cors(org.springframework.security.config.Customizer.withDefaults())
				.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/api/authpreview").permitAll()
						.requestMatchers("/api/certificates/verify/**").permitAll()
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.requestMatchers("/api/progress/**").hasRole("STUDENT")
						.requestMatchers(HttpMethod.POST, "/api/enrollments/**").hasRole("STUDENT")
						.requestMatchers(HttpMethod.GET, "/api/enrollments/me").authenticated()
						.requestMatchers("/api/payments/**").hasRole("STUDENT")
						.requestMatchers("/api/certificates/generate/**").hasRole("STUDENT")
						.requestMatchers("/api/certificates/my").hasRole("STUDENT")
						.requestMatchers(HttpMethod.POST, "/api/courses").hasRole("TEACHER")
						.requestMatchers(HttpMethod.POST, "/api/courses/{courseId}/lessons").hasRole("TEACHER")
						.requestMatchers(HttpMethod.GET, "/api/enrollments/course/{courseId}/students")
						.hasRole("TEACHER")
						.requestMatchers("/api/upload/**").hasRole("TEACHER")
						.requestMatchers(HttpMethod.POST, "/api/courses/{courseId}/tasks").hasRole("TEACHER")
						.requestMatchers(HttpMethod.GET, "/api/courses/{courseId}/tasks").authenticated()
						.requestMatchers(HttpMethod.POST, "/api/tasks/{taskId}/complete").hasRole("STUDENT")
						.requestMatchers("/api/users/**").authenticated()
						.requestMatchers(HttpMethod.GET, "/api/courses/{courseId}/lessons").authenticated()
						.anyRequest().authenticated())
				.exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}
}
