package com.elanur.elatelekom.service;

import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Kullanıcı kayıt
    public User register(String username, String password) {
        // uq kullanıcı ismi kontrol
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new RuntimeException("Bu kullanıcı adı zaten alınmış!");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(password); //şifre hash
        return userRepository.save(user);
    }

    // Kullanıcı giriş
    public boolean login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        return userOpt.isPresent() && userOpt.get().getPassword().equals(password);
    }
}
