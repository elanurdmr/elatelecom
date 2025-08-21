package com.elanur.elatelekom.service;

import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private UserRepository userRepository;

    public User toggleFavorite(String userId, String productId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<String> favoriteProductIds = user.getFavoriteProductIds();
            if (favoriteProductIds.contains(productId)) {
                favoriteProductIds.remove(productId);
            } else {
                favoriteProductIds.add(productId);
            }
            user.setFavoriteProductIds(favoriteProductIds);
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public List<String> getUserFavorites(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.map(User::getFavoriteProductIds).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
