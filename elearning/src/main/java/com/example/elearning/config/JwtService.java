package com.example.elearning.config;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtService {
	
	 private static final String SECRET =
	            "elearning-secret-key-elearning-secret-key-123456";

	    private static final long EXPIRATION = 1000 * 60 * 60 * 24;

	    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

	    public String generateToken(String email, String role) {
	        return Jwts.builder()
	                .setSubject(email)
	                .claim("role", role)
	                .setIssuedAt(new Date())
	                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
	                .signWith(key, SignatureAlgorithm.HS256)
	                .compact();
	    }

	    public String extractEmail(String token) {
	        return parse(token).getBody().getSubject();
	    }

	    public boolean validate(String token) {
	        try {
	            parse(token);
	            return true;
	        } catch (JwtException e) {
	            return false;
	        }
	    }

	    private Jws<Claims> parse(String token) {
	        return Jwts.parserBuilder()
	                .setSigningKey(key)
	                .build()
	                .parseClaimsJws(token);
	    }

}
