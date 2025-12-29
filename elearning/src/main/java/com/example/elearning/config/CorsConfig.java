package com.example.elearning.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

        @Bean
        public CorsFilter corsFilter() {
                CorsConfiguration config = new CorsConfiguration();

                // Allow credentials
                config.setAllowCredentials(true);

                // Allow frontend origin (using patterns for credentials support)
                config.setAllowedOriginPatterns(Arrays.asList(
                                "http://localhost:5173",
                                "http://localhost:3000",
                                "http://127.0.0.1:5173"));

                // Allow all headers
                config.addAllowedHeader("*");

                // Allow all HTTP methods
                config.setAllowedMethods(Arrays.asList(
                                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

                // Expose headers
                config.setExposedHeaders(Arrays.asList(
                                "Authorization", "Content-Type"));

                // Max age for preflight requests
                config.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", config);

                return new CorsFilter(source);
        }
}
