package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.repository.UserRepository;
import com.elanur.elatelekom.service.MailService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepo;
    private final MailService mailService;

    public AuthController(UserRepository userRepo, MailService mailService) {
        this.userRepo = userRepo;
        this.mailService = mailService;
    }

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password, @RequestParam String email) {
        if(userRepo.findByUsername(username).isPresent()) {
            return "Kullanıcı zaten var!";
        }
        User user = new User(username, password, email);
        userRepo.save(user);


        // Mail gönder
        String subject = "ElaTelekom Kayıt Başarılı";
        String text = "Merhaba " + username + ",\n\nKaydınız başarıyla oluşturuldu!";
        mailService.sendMail(email, subject, text);

        return "Kayıt başarılı! Mail gönderildi.";
    }

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password, HttpSession session) {
        Optional<User> userOpt = userRepo.findByUsername(username);
        if(userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            session.setAttribute("user", username);
            return "Giriş başarılı!";
        }
        return "Kullanıcı adı veya şifre hatalı!";
    }

    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "Çıkış yapıldı!";
    }
}
