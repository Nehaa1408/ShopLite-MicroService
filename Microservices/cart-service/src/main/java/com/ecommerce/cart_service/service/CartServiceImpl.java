package com.ecommerce.cart_service.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ecommerce.cart_service.client.ProductClient;
import com.ecommerce.cart_service.dto.CartRequest;
import com.ecommerce.cart_service.dto.CartResponse;
import com.ecommerce.cart_service.dto.ProductResponse;
import com.ecommerce.cart_service.dto.UpdateCartRequest;
import com.ecommerce.cart_service.entity.Cart;
import com.ecommerce.cart_service.repository.CartRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;

    // ================= ADD TO CART =================
    @Override
    public CartResponse addToCart(Long userId, CartRequest request) {

        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        // Fetch product from Product Service
        ProductResponse product = productClient.getProductById(request.getProductId());

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        if (!product.isActive()) {
            throw new RuntimeException("Product is inactive");
        }

        Cart cart = cartRepository
                .findByUserIdAndProductId(userId, request.getProductId())
                .orElse(new Cart());

        if (cart.getId() != null) {

            int newQuantity = cart.getQuantity() + request.getQuantity();

            if (product.getQuantity() < newQuantity) {
                throw new RuntimeException("Insufficient stock");
            }

            cart.setQuantity(newQuantity);
            cart.setPrice(product.getPrice());

        } else {

            if (product.getQuantity() < request.getQuantity()) {
                throw new RuntimeException("Insufficient stock");
            }

            cart.setUserId(userId);
            cart.setProductId(product.getId());
            cart.setQuantity(request.getQuantity());
            cart.setPrice(product.getPrice());
        }

        Cart savedCart = cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    // ================= GET CART =================
    @Override
    public List<CartResponse> getCart(Long userId) {

        return cartRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ================= UPDATE QUANTITY =================
    @Override
    public CartResponse updateQuantity(Long userId,
            Long cartId,
            UpdateCartRequest request) {

        if (request.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        ProductResponse product = productClient.getProductById(cart.getProductId());

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        if (!product.isActive()) {
            throw new RuntimeException("Product is inactive");
        }

        if (product.getQuantity() < request.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        cart.setQuantity(request.getQuantity());
        cart.setPrice(product.getPrice());

        Cart updatedCart = cartRepository.save(cart);

        return mapToResponse(updatedCart);
    }

    // ================= REMOVE ITEM =================
    @Override
    public void removeItem(Long userId, Long cartId) {

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cart.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access");
        }

        cartRepository.delete(cart);
    }

    // ================= CLEAR CART =================
    @Override
    public void clearCart(Long userId) {

        cartRepository.deleteByUserId(userId);
    }

    // ================= DTO MAPPER =================
    private CartResponse mapToResponse(Cart cart) {

        Double subtotal = 0.0;

        if (cart.getPrice() != null) {
            subtotal = cart.getPrice() * cart.getQuantity();
        }

        return new CartResponse(
                cart.getId(),
                cart.getProductId(),
                cart.getQuantity(),
                cart.getPrice(),
                subtotal);
    }
}