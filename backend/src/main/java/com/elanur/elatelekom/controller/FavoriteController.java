package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.elanur.elatelekom.service.AuthService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;
    @Autowired
    private AuthService authService;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Assuming the principal is an instance of org.springframework.security.core.userdetails.User
        // or a custom UserDetails implementation that has the ID
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated.");
        }
        String userEmail = authentication.getName(); // This should be the email/username
        User user = authService.getUserByEmail(userEmail);
        return user.getId(); // Return the actual MongoDB ID
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<User> toggleFavorite(@PathVariable String productId) {
        String userId = getCurrentUserId();
        User updatedUser = favoriteService.toggleFavorite(userId, productId);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping
    public ResponseEntity<List<String>> getUserFavorites() {
        String userId = getCurrentUserId();
        List<String> favoriteProductIds = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favoriteProductIds);
    }
}
