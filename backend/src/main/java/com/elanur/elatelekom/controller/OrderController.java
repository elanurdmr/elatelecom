package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.Order;
import com.elanur.elatelekom.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.service.AuthService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private AuthService authService;

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestBody CreateOrderRequest request) {
        String userId = getCurrentUserId();
        Order order = orderService.createOrder(
            userId,
            request.getShippingAddress(),
            request.getShippingCity(),
            request.getShippingPostalCode(),
            request.getShippingCountry(),
            request.getShippingPhone(),
            request.getNotes()
        );
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders() {
        String userId = getCurrentUserId();
        List<Order> orders = orderService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrder(@PathVariable String orderId) {
        String userId = getCurrentUserId();
        Order order = orderService.getOrderById(orderId);
        
        // Check if user owns this order or is admin
        if (!order.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(order);
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<Order> getOrderByNumber(@PathVariable String orderNumber) {
        String userId = getCurrentUserId();
        Order order = orderService.getOrderByOrderNumber(orderNumber);
        
        // Check if user owns this order or is admin
        if (!order.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable String orderId, @RequestBody CancelOrderRequest request) {
        String userId = getCurrentUserId();
        Order order = orderService.getOrderById(orderId);

        // Check if user owns this order or is admin
        if (!order.getUserId().equals(userId)) {
            return ResponseEntity.status(403).build();
        }

        try {
            Order cancelledOrder = orderService.cancelOrder(orderId, request.getCancelReason());
            return ResponseEntity.ok(cancelledOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null); // Hata durumunda boş gövde döndür
        }
    }

    // Admin only: Update order status
    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String orderId, @RequestBody UpdateOrderStatusRequest request) {
        // Admin rolü kontrolü
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null); // Yetkilendirilmemiş
        }
        String userEmail = authentication.getName();
        User currentUser = authService.getUserByEmail(userEmail);

        if (currentUser == null || currentUser.getRole() != User.UserRole.ADMIN) {
            return ResponseEntity.status(403).body(null); // Yasak - Admin değil
        }

        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, request.getStatus());
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated.");
        }
        String userEmail = authentication.getName();
        User user = authService.getUserByEmail(userEmail);
        return user.getId();
    }

    // Request DTO
    public static class CreateOrderRequest {
        private String shippingAddress;
        private String shippingCity;
        private String shippingPostalCode;
        private String shippingCountry;
        private String shippingPhone;
        private String notes;

        // Getters and Setters
        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

        public String getShippingCity() { return shippingCity; }
        public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }

        public String getShippingPostalCode() { return shippingPostalCode; }
        public void setShippingPostalCode(String shippingPostalCode) { this.shippingPostalCode = shippingPostalCode; }

        public String getShippingCountry() { return shippingCountry; }
        public void setShippingCountry(String shippingCountry) { this.shippingCountry = shippingCountry; }

        public String getShippingPhone() { return shippingPhone; }
        public void setShippingPhone(String shippingPhone) { this.shippingPhone = shippingPhone; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class CancelOrderRequest {
        private String cancelReason;

        public String getCancelReason() {
            return cancelReason;
        }

        public void setCancelReason(String cancelReason) {
            this.cancelReason = cancelReason;
        }
    }

    public static class UpdateOrderStatusRequest {
        private Order.OrderStatus status;

        public Order.OrderStatus getStatus() {
            return status;
        }

        public void setStatus(Order.OrderStatus status) {
            this.status = status;
        }
    }
}
