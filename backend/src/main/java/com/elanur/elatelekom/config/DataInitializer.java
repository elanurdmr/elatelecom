package com.elanur.elatelekom.config;

import com.elanur.elatelekom.model.Product;
import com.elanur.elatelekom.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Eğer ürün yoksa örnek ürünleri ekle
        if (productRepository.count() == 0) {
            initializeProducts();
        }
    }

    private void initializeProducts() {
        // Cihaz ürünleri
        Product iphone = new Product();
        iphone.setName("iPhone 15 Pro");
        iphone.setDescription("Apple iPhone 15 Pro 128GB Titanium");
        iphone.setPrice(89999.0);
        iphone.setCategory("cihaz");
        iphone.setStock(50);
        iphone.setImage("/images/iphone15pro.jpg");
        iphone.setTags(Arrays.asList("telefon", "apple", "5G"));
        productRepository.save(iphone);

        Product samsung = new Product();
        samsung.setName("Samsung Galaxy S24");
        samsung.setDescription("Samsung Galaxy S24 256GB Phantom Black");
        samsung.setPrice(79999.0);
        samsung.setCategory("cihaz");
        samsung.setStock(45);
        samsung.setImage("/images/samsung-s24.jpg");
        samsung.setTags(Arrays.asList("telefon", "samsung", "5G"));
        productRepository.save(samsung);

        Product xiaomi = new Product();
        xiaomi.setName("Xiaomi Redmi Note 13");
        xiaomi.setDescription("Xiaomi Redmi Note 13 128GB Black");
        xiaomi.setPrice(15999.0);
        xiaomi.setCategory("cihaz");
        xiaomi.setStock(80);
        xiaomi.setImage("/images/xiaomi-redmi13.jpg");
        xiaomi.setTags(Arrays.asList("telefon", "xiaomi", "4G"));
        productRepository.save(xiaomi);

        // SIM kart ürünleri
        Product turkcellSim = new Product();
        turkcellSim.setName("Turkcell SIM Kart");
        turkcellSim.setDescription("Turkcell 4.5G SIM Kart");
        turkcellSim.setPrice(50.0);
        turkcellSim.setCategory("sim");
        turkcellSim.setStock(200);
        turkcellSim.setImage("/images/turkcell-sim.jpg");
        turkcellSim.setTags(Arrays.asList("sim", "turkcell", "4.5G"));
        productRepository.save(turkcellSim);

        Product vodafoneSim = new Product();
        vodafoneSim.setName("Vodafone SIM Kart");
        vodafoneSim.setDescription("Vodafone 4.5G SIM Kart");
        vodafoneSim.setPrice(50.0);
        vodafoneSim.setCategory("sim");
        vodafoneSim.setStock(180);
        vodafoneSim.setImage("/images/vodafone-sim.jpg");
        vodafoneSim.setTags(Arrays.asList("sim", "vodafone", "4.5G"));
        productRepository.save(vodafoneSim);

        // Tarife paketleri
        Product turkcellPaket = new Product();
        turkcellPaket.setName("Turkcell Tarife Paketi");
        turkcellPaket.setDescription("Turkcell 20GB İnternet + 1000 Dakika");
        turkcellPaket.setPrice(199.0);
        turkcellPaket.setCategory("paket");
        turkcellPaket.setStock(100);
        turkcellPaket.setImage("/images/turkcell-paket.jpg");
        turkcellPaket.setTags(Arrays.asList("tarife", "turkcell", "internet"));
        productRepository.save(turkcellPaket);

        Product vodafonePaket = new Product();
        vodafonePaket.setName("Vodafone Tarife Paketi");
        vodafonePaket.setDescription("Vodafone 25GB İnternet + 1500 Dakika");
        vodafonePaket.setPrice(249.0);
        vodafonePaket.setCategory("paket");
        vodafonePaket.setStock(90);
        vodafonePaket.setImage("/images/vodafone-paket.jpg");
        vodafonePaket.setTags(Arrays.asList("tarife", "vodafone", "internet"));
        productRepository.save(vodafonePaket);

        System.out.println("Örnek ürünler veritabanına eklendi!");
    }
}
