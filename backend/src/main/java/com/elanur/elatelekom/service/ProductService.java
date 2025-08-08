package com.elanur.elatelekom.service;

import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Optional<Product> getProductById(String id) {
        return repository.findById(id);
    }

    public Product addProduct(Product product) {
        return repository.save(product);
    }

    // Burada da id String olmalı
    public void deleteProduct(String id) {
        repository.deleteById(id);
    }
}
