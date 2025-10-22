package service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import model.product;
import repository.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Get all products
    public List<product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get a single product
    public Optional<product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Add or update product
    public product saveProduct(product product) {
        return productRepository.save(product);
    }

    // Delete product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
