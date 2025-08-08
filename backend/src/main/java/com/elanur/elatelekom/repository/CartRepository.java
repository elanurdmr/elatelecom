package com.elanur.elatelekom.repository;

import com.elanur.elatelekom.model.CartItem;
import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CartRepository extends MongoRepository<CartItem, String> {
   
    // Belirli kullanıcının tüm sepet ürünleri
    List<CartItem> findByUser(User user);

    // Kullanıcı ve ürün ile sepetteki belirli ürünü bulma
    CartItem findByUserAndProduct(User user, Product product);
}
