package com.elanur.elatelekom.service;

import com.elanur.elatelekom.model.CartItem;
import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.repository.CartRepository;
import com.elanur.elatelekom.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public CartItem addToCart(String userId, String productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cartRepository.findByUserIdAndProductId(userId, productId);

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartRepository.save(item);
        } else {
            CartItem newItem = new CartItem(
                userId, 
                productId, 
                product.getName(), 
                product.getImage(), 
                product.getPrice(), 
                quantity
            );
            return cartRepository.save(newItem);
        }
    }

    public List<CartItem> getUserCart(String userId) {
        return cartRepository.findByUserId(userId);
    }

    public void removeFromCart(String userId, String productId) {
        cartRepository.deleteByUserIdAndProductId(userId, productId);
    }

    public CartItem updateQuantity(String userId, String productId, int quantity) {
        CartItem existingItem = cartRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        existingItem.setQuantity(quantity);
        return cartRepository.save(existingItem);
    }

    public void clearCart(String userId) {
        cartRepository.deleteByUserId(userId);
    }

    public double getCartTotal(String userId) {
        List<CartItem> cartItems = getUserCart(userId);
        return cartItems.stream()
                .mapToDouble(CartItem::getTotal)
                .sum();
    }

    public int getCartItemCount(String userId) {
        List<CartItem> cartItems = getUserCart(userId);
        return cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();
    }
}
