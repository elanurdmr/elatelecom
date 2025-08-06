package com.elanur.elatelekom.repository;

import com.elanur.elatelekom.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
    // Gerekirse özel sorgular buraya
}
