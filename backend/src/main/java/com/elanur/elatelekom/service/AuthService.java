package com.elanur.elatelekom.service;

import com.elanur.elatelekom.config.JwtUtil;
import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.repository.UserRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @SuppressWarnings("unused") // Used via getter in AuthController
    private final JwtUtil jwtUtil;

    // Constructor Injection
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public JwtUtil getJwtUtil() {
        return jwtUtil;
    }

    public User register(String email, String rawPassword, String firstName, String lastName) {
        if (email == null || email.isBlank() || rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException("Email and password are required");
        }

        email = email.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("Email already in use");
        }

        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));

        try {
            return userRepository.save(user);
        } catch (DuplicateKeyException e) {
            throw new EmailAlreadyExistsException("Email already in use");
        }
    }

    public User login(String email, String password) {
        email = email.trim().toLowerCase(); // Ensure email is lowercase for login
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) { 
            throw new UnauthorizedException("Invalid email or password");
        }

        return user; // Return the user object
    }

    public User getUserByEmail(String email) { // getUserByUsername yerine getUserByEmail
        email = email.trim().toLowerCase(); // Ensure email is lowercase for lookup
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUserProfile(String userId, String firstName, String lastName, 
                                String phone, String address, String city, String postalCode, String country) {
        User user = getUserById(userId);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        user.setAddress(address);
        user.setCity(city);
        user.setPostalCode(postalCode);
        user.setCountry(country);
        user.updateTimestamp();
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserStatus(String userId, boolean active) {
        User user = getUserById(userId);
        user.setActive(active);
        user.updateTimestamp();
        return userRepository.save(user);
    }

    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = getUserById(userId);
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) { // passwordHash kullan
            throw new RuntimeException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword)); // passwordHash kullan
        user.updateTimestamp();
        userRepository.save(user);
    }

    // Custom Exception for Authentication
    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) {
            super(message);
        }
    }

    // Custom Exception for Email Already Exists
    public static class EmailAlreadyExistsException extends RuntimeException {
        public EmailAlreadyExistsException(String message) {
            super(message);
        }
    }
}
