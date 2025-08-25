package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Constructor injection (field @Autowired yerine)
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ---------- REGISTER ----------
    @PostMapping(path = "/register", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String email = safe(request.getEmail());
        try {
            User user = authService.register(
                    email,
                    request.getPassword(),
                    request.getFirstName(),
                    request.getLastName()
            );
            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful!",
                    "userId", user.getId()
            ));
        } catch (AuthService.EmailAlreadyExistsException e) {
            return ResponseEntity.status(409).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // konsola tam stack trace
            return ResponseEntity.status(500).body(Map.of("error", "Internal error"));
        }
    }

    // ---------- LOGIN ----------
    @PostMapping(path = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String email = safe(request.getEmail());
        try {
            User user = authService.login(email, request.getPassword());
            String token = authService.getJwtUtil().generateToken(
                    new org.springframework.security.core.userdetails.User(
                            user.getEmail(),
                            user.getPasswordHash(),
                            user.getAuthorities()
                    )
            );
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful!",
                    "token", token,
                    "email", email,
                    "user", user // Kullanıcı nesnesini ekle
            ));
        } catch (AuthService.UnauthorizedException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Internal error"));
        }
    }

    // ---------- PROFILE (GET) ----------
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        String email = currentUserEmail();
        User user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    // ---------- PROFILE (PUT) ----------
    @PutMapping(path = "/profile", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        String email = currentUserEmail();
        User user = authService.getUserByEmail(email);

        User updated = authService.updateUserProfile(
                user.getId(),
                request.getFirstName(),
                request.getLastName(),
                request.getPhone(),
                request.getAddress(),
                request.getCity(),
                request.getPostalCode(),
                request.getCountry()
        );
        return ResponseEntity.ok(updated);
    }

    // ---------- CHANGE PASSWORD ----------
    @PutMapping(path = "/users/{userId}/change-password", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> changePassword(@PathVariable String userId, @RequestBody ChangePasswordRequest request) {
        try {
            User user = authService.getUserById(userId);
            authService.changePassword(user.getId(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password changed successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ---------- Helpers ----------
    private static String safe(String s) {
        return s == null ? null : s.trim().toLowerCase();
    }

    private static String currentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // JWT filter username olarak email’i set ediyorsa:
        return auth.getName();
    }

    // ---------- Request DTOs ----------
    public static class RegisterRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
        @NotBlank private String firstName;
        @NotBlank private String lastName;
        private String phone;
        private String address;
        private String city;
        private String postalCode;
        private String country;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }

    public static class LoginRequest {
        @NotBlank @Email private String email;
        @NotBlank private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private String phone;
        private String address;
        private String city;
        private String postalCode;
        private String country;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }

    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;

        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
