package com.elanur.elatelekom.service;

import com.elanur.elatelekom.model.CartItem;
import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.repository.CartRepository;
import com.elanur.elatelekom.repository.ProductRepository;
import com.elanur.elatelekom.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Sepet ürün+
    public CartItem addToCart(String userId, String productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        CartItem existingItem = cartRepository.findByUserAndProduct(user, product);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity); // Miktar arttır
            return cartRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            return cartRepository.save(newItem);
        }
    }

    // user ssepetini getir
    public List<CartItem> getCartByUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        return cartRepository.findByUser(user);
    }

    // Sepetten ürün çıkar
    public void removeFromCart(String userId, String productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        CartItem existingItem = cartRepository.findByUserAndProduct(user, product);
        if (existingItem != null) {
            cartRepository.delete(existingItem);
        }
    }

    // ürün miktarını güncelle
    public CartItem updateQuantity(String userId, String productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı"));

        CartItem existingItem = cartRepository.findByUserAndProduct(user, product);
        if (existingItem != null) {
            existingItem.setQuantity(quantity);
            return cartRepository.save(existingItem);
        } else {
            throw new RuntimeException("Sepette böyle bir ürün yok");
        }
    }
}
