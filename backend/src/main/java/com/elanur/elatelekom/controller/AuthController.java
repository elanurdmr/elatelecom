package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Kullanıcı kayıt endpointi
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User req) {
        try {
            User created = authService.register(req.getUsername(), req.getPassword());
            created.setPassword(null);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    // Kullanıcı giriş endpointi
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User req) {
        boolean success = authService.login(req.getUsername(), req.getPassword());
        if (success) {
            return ResponseEntity.ok().body("Login successful");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
