package com.elanur.elatelekom.service;

import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.model.SliderItem;
import com.elanur.elatelekom.repository.ProductRepository;
import com.elanur.elatelekom.repository.SliderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeService {

    @Autowired
    private SliderItemRepository sliderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // Slider verileri
    public List<SliderItem> getSliderItems() {
        return sliderItemRepository.findAll();
    }

    //şimdilik 5 tane getiriyor
    public List<Product> getFeaturedProducts() {
        return productRepository.findAll().stream().limit(5).toList();
    }
}