package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return service.getAllProducts();
    }

    @GetMapping("/{id}")
    public Optional<Product> getProduct(@PathVariable String id) {
        return service.getProductById(id);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return service.addProduct(product);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id) {  // String yaptık
        service.deleteProduct(id);
    }

    @GetMapping("/test-mongo")
    public String testMongoConnection() {
        long count = service.getAllProducts().size();
        return "MongoDB bağlantısı başarılı, toplam ürün sayısı: " + count;
    }
}
