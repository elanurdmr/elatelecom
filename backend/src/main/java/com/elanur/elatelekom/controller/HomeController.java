package com.elanur.elatelekom.controller;

import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.model.SliderItem;
import com.elanur.elatelekom.service.HomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/home")
public class HomeController {

    @Autowired
    private HomeService homeService;

    // Ana sayfadaki slider verilerini getir
    @GetMapping("/slider")
    public List<SliderItem> getSliderItems() {
        return homeService.getSliderItems();
    }

    // Ana sayfadaki öne çıkan ürünleri getir
    @GetMapping("/featured-products")
    public List<Product> getFeaturedProducts() {
        return homeService.getFeaturedProducts();
    }
}
