package com.elanur.elatelekom.service;

import com.elanur.elatelekom.model.CartItem;
import com.elanur.elatelekom.model.Order;
import com.elanur.elatelekom.model.OrderItem;
import com.elanur.elatelekom.repository.CartRepository;
import com.elanur.elatelekom.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    public Order createOrder(String userId, String shippingAddress, String shippingCity, 
                           String shippingPostalCode, String shippingCountry, String shippingPhone, String notes) {
        
        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Convert cart items to order items
        List<OrderItem> orderItems = cartItems.stream()
                .map(cartItem -> new OrderItem(
                        cartItem.getProductId(),
                        cartItem.getProductName(),
                        cartItem.getProductImage(),
                        cartItem.getQuantity(),
                        cartItem.getProductPrice()
                ))
                .collect(Collectors.toList());

        Order order = new Order();
        order.setUserId(userId);
        order.setOrderNumber(generateOrderNumber());
        order.setItems(orderItems);
        order.setShippingAddress(shippingAddress);
        order.setShippingCity(shippingCity);
        order.setShippingPostalCode(shippingPostalCode);
        order.setShippingCountry(shippingCountry);
        order.setShippingPhone(shippingPhone);
        order.setNotes(notes);
        order.setShippingCost(calculateShippingCost(orderItems));
        order.calculateTotals();

        // Clear cart after order creation
        cartRepository.deleteByUserId(userId);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateOrderStatus(String orderId, Order.OrderStatus status) {
        Order order = getOrderById(orderId);
        System.out.println("Updating order " + orderId + " status to: " + status);
        order.setStatus(status);
        
        if (status == Order.OrderStatus.SHIPPED) {
            order.setShippedAt(LocalDateTime.now());
        } else if (status == Order.OrderStatus.DELIVERED) {
            order.setDeliveredAt(LocalDateTime.now());
        }
        
        order.updateTimestamp();
        return orderRepository.save(order);
    }

    public Order cancelOrder(String orderId, String cancelReason) {
        Order order = getOrderById(orderId);
        if (order.getStatus() == Order.OrderStatus.DELIVERED || 
            order.getStatus() == Order.OrderStatus.CANCELLED ||
            order.getStatus() == Order.OrderStatus.SHIPPED) {
            throw new RuntimeException("Sipariş teslim edildi, yola çıktı veya zaten iptal edildiği için iptal edilemez.");
        }
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancelReason(cancelReason); // Set the cancel reason
        order.updateTimestamp();
        return orderRepository.save(order);
    }

    private String generateOrderNumber() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private double calculateShippingCost(List<OrderItem> items) {
        // Simple shipping calculation - can be made more complex
        int totalItems = items.stream().mapToInt(OrderItem::getQuantity).sum();
        if (totalItems <= 3) {
            return 10.0; // Base shipping cost
        } else if (totalItems <= 10) {
            return 15.0; // Medium shipping cost
        } else {
            return 20.0; // High shipping cost
        }
    }
}
