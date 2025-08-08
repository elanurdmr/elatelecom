package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Kullanıcı kayıt endpointi
    @PostMapping("/register")
    public User register(@RequestParam String username,
                         @RequestParam String password) {
        return authService.register(username, password);
    }

    // Kullanıcı giriş endpointi
    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {
        boolean success = authService.login(username, password);
        if (success) {
            return "Giriş başarılı! Hoşgeldin " + username;
        } else {
            return "Kullanıcı adı veya şifre hatalı!";
        }
    }
}
