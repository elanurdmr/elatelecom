package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.Order;
import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.model.User;
import com.elanur.elatelekom.model.User.UserRole;
import com.elanur.elatelekom.service.OrderService;
import com.elanur.elatelekom.service.ProductService;
import com.elanur.elatelekom.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private AuthService authService;

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody UpdateStatusRequest request) {
        Order order = orderService.updateOrderStatus(orderId, request.getStatus());
        return ResponseEntity.ok(order);
    }

    // Product Management
    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String productId,
            @RequestBody Product product) {
        product.setId(productId);
        Product updatedProduct = productService.updateProduct(product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User newUser = authService.createUserWithRole(
                request.getEmail(), request.getPassword(), request.getFirstName(), request.getLastName(), request.getRole()
        );
        return ResponseEntity.ok(newUser);
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable String userId,
            @RequestBody UpdateUserRequest request) {
        User user = authService.getUserById(userId);

        // Update basic profile fields
        user = authService.updateUserProfile(
                userId, request.getFirstName(), request.getLastName(),
                user.getPhone(), user.getAddress(), user.getCity(), user.getPostalCode(), user.getCountry()
        );

        // Update role if provided
        if (request.getRole() != null) {
            user = authService.updateUserRole(userId, request.getRole());
        }

        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user = authService.updateUserPassword(userId, request.getPassword());
        }

        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        authService.deleteUser(userId); // AuthService'e deleteUser metodu eklenecek
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<User> updateUserStatus(
            @PathVariable String userId,
            @RequestBody UpdateUserStatusRequest request) {
        User user = authService.updateUserStatus(userId, request.isActive());
        return ResponseEntity.ok(user);
    }

    // Request DTOs
    public static class UpdateStatusRequest {
        private Order.OrderStatus status;

        public Order.OrderStatus getStatus() { return status; }
        public void setStatus(Order.OrderStatus status) { this.status = status; }
    }

    public static class UpdateUserStatusRequest {
        private boolean active;

        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
    }

    // New DTOs for User Management
    public static class CreateUserRequest {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private UserRole role;

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public UserRole getRole() { return role; }
        public void setRole(UserRole role) { this.role = role; }
    }

    public static class UpdateUserRequest {
        private String firstName;
        private String lastName;
        private String password; // Optional for update
        private UserRole role; // Optional for update

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public UserRole getRole() { return role; }
        public void setRole(UserRole role) { this.role = role; }
    }
}
