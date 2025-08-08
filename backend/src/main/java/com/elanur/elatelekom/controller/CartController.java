package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.CartItem;
import com.elanur.elatelekom.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Sepete ürün ekle
    @PostMapping("/add")
    public CartItem addToCart(@RequestParam String userId,
                              @RequestParam String productId,
                              @RequestParam int quantity) {
        return cartService.addToCart(userId, productId, quantity);
    }

    // Kullanıcının sepetini getir
    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable String userId) {
        return cartService.getCartByUser(userId);
    }

    // Sepetten ürün çıkar
    @DeleteMapping("/remove")
    public void removeFromCart(@RequestParam String userId,
                               @RequestParam String productId) {
        cartService.removeFromCart(userId, productId);
    }

    // Miktar güncelle
    @PutMapping("/update")
    public CartItem updateQuantity(@RequestParam String userId,
                                   @RequestParam String productId,
                                   @RequestParam int quantity) {
        return cartService.updateQuantity(userId, productId, quantity);
    }
}
