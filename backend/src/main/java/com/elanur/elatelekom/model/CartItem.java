package com.elanur.elatelekom.model;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.*;

@Document
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    // Her CartItem bir User'a ait olacak 
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Her CartItem bir Product içerir
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity; // Sepetteki ürün miktarı

    // Getter & Setter
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
