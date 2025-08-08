package com.elanur.elatelekom.repository;

import com.elanur.elatelekom.model.SliderItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SliderItemRepository extends MongoRepository<SliderItem, String> {
}
