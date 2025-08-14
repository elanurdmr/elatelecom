package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.CartItem;
import com.elanur.elatelekom.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestBody AddToCartRequest request) {
        String userId = getCurrentUserId();
        CartItem cartItem = cartService.addToCart(userId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    @GetMapping("/items")
    public ResponseEntity<List<CartItem>> getCart() {
        String userId = getCurrentUserId();
        List<CartItem> cartItems = cartService.getUserCart(userId);
        return ResponseEntity.ok(cartItems);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable String productId) {
        String userId = getCurrentUserId();
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{productId}")
    public ResponseEntity<CartItem> updateQuantity(
            @PathVariable String productId,
            @RequestBody UpdateQuantityRequest request) {
        String userId = getCurrentUserId();
        CartItem cartItem = cartService.updateQuantity(userId, productId, request.getQuantity());
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        String userId = getCurrentUserId();
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/total")
    public ResponseEntity<Map<String, Object>> getCartTotal() {
        String userId = getCurrentUserId();
        double total = cartService.getCartTotal(userId);
        int itemCount = cartService.getCartItemCount(userId);
        
        Map<String, Object> response = Map.of(
            "total", total,
            "itemCount", itemCount
        );
        return ResponseEntity.ok(response);
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    // Request DTOs
    public static class AddToCartRequest {
        private String productId;
        private int quantity;

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }

    public static class UpdateQuantityRequest {
        private int quantity;

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}
