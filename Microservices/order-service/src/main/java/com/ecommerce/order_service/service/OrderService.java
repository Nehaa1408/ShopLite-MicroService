package com.ecommerce.order_service.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.order_service.client.CartClient;
import com.ecommerce.order_service.client.ProductClient;
import com.ecommerce.order_service.dto.CartItemResponse;
import com.ecommerce.order_service.dto.OrderItemResponse;
import com.ecommerce.order_service.dto.OrderResponse;
import com.ecommerce.order_service.dto.PlaceOrderRequest;
import com.ecommerce.order_service.dto.ProductResponse;
import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderItem;
import com.ecommerce.order_service.entity.OrderStatus;
import com.ecommerce.order_service.entity.PaymentMethod;
import com.ecommerce.order_service.entity.PaymentStatus;
import com.ecommerce.order_service.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;

        private final CartClient cartClient;

        private final ProductClient productClient;

        // =====================================================
        // PLACE ORDER
        // =====================================================

        @Transactional
        public OrderResponse placeOrder(
                        Long userId,
                        PlaceOrderRequest request) {

                // -------------------------------------------------
                // 1. GET CART
                // -------------------------------------------------

                List<CartItemResponse> cartItems = cartClient.getCart(userId);

                if (cartItems == null || cartItems.isEmpty()) {
                        throw new RuntimeException("Cart is empty");
                }

                // -------------------------------------------------
                // 2. CREATE ORDER
                // -------------------------------------------------

                Order order = new Order();

                order.setUserId(userId);

                order.setStatus(OrderStatus.PENDING);

                // -------------------------------------------------
                // 3. PAYMENT METHOD
                // -------------------------------------------------

                PaymentMethod paymentMethod;

                try {

                        paymentMethod = PaymentMethod.valueOf(
                                        request.getPaymentMethod().toUpperCase());

                } catch (Exception e) {

                        throw new RuntimeException(
                                        "Invalid payment method");
                }

                order.setPaymentMethod(paymentMethod);

                // -------------------------------------------------
                // 4. PAYMENT STATUS
                // -------------------------------------------------

                if (paymentMethod == PaymentMethod.COD) {

                        order.setPaymentStatus(
                                        PaymentStatus.COD_PENDING);

                } else {

                        order.setPaymentStatus(
                                        PaymentStatus.PENDING_VERIFICATION);
                }

                // -------------------------------------------------
                // 5. CREATE ORDER ITEMS
                // -------------------------------------------------

                List<OrderItem> orderItems = new ArrayList<>();

                double subtotal = 0.0;

                for (CartItemResponse cartItem : cartItems) {

                        // Get latest product information
                        ProductResponse product = productClient.getProductById(
                                        cartItem.getProductId());

                        // -------------------------------------------------
                        // PRODUCT VALIDATION
                        // -------------------------------------------------

                        if (product == null) {

                                throw new RuntimeException(
                                                "Product not found: "
                                                                + cartItem.getProductId());
                        }

                        if (!product.isActive()) {

                                throw new RuntimeException(
                                                "Product is inactive: "
                                                                + product.getName());
                        }

                        // -------------------------------------------------
                        // STOCK VALIDATION
                        // -------------------------------------------------

                        if (product.getQuantity() < cartItem.getQuantity()) {

                                throw new RuntimeException(
                                                "Insufficient stock for product: "
                                                                + product.getName());
                        }

                        // -------------------------------------------------
                        // CREATE ORDER ITEM
                        // -------------------------------------------------

                        OrderItem orderItem = new OrderItem();

                        orderItem.setOrder(order);

                        orderItem.setProductId(product.getId());

                        orderItem.setProductName(product.getName());

                        orderItem.setProductImage(product.getImageUrl());

                        orderItem.setPrice(product.getPrice());

                        orderItem.setQuantity(cartItem.getQuantity());

                        double itemSubtotal = product.getPrice()
                                        * cartItem.getQuantity();

                        orderItem.setSubtotal(itemSubtotal);

                        subtotal += itemSubtotal;

                        orderItems.add(orderItem);
                }

                // -------------------------------------------------
                // 6. CALCULATE TAX
                // -------------------------------------------------

                double tax = subtotal * 0.04;

                double finalTotal = subtotal + tax;

                // -------------------------------------------------
                // 7. SET ORDER DETAILS
                // -------------------------------------------------

                order.setItems(orderItems);

                order.setTotalAmount(finalTotal);

                // -------------------------------------------------
                // 8. SAVE ORDER
                // -------------------------------------------------

                Order savedOrder = orderRepository.save(order);

                // -------------------------------------------------
                // 9. CLEAR CART
                // -------------------------------------------------

                cartClient.clearCart(userId);

                // -------------------------------------------------
                // 10. RETURN RESPONSE
                // -------------------------------------------------

                return mapToResponse(savedOrder);
        }

        // =====================================================
        // GET USER ORDERS
        // =====================================================

        @Transactional(readOnly = true)
        public List<OrderResponse> getUserOrders(Long userId) {

                List<Order> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);

                return orders.stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // =====================================================
        // GET ORDER BY ID
        // =====================================================

        @Transactional(readOnly = true)
        public OrderResponse getOrderById(Long orderId, Long userId) {

                Order order = orderRepository
                                .findByIdAndUserId(orderId, userId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                return mapToResponse(order);
        }
        // =====================================================
        // CANCEL ORDER
        // =====================================================

        @Transactional
        public OrderResponse cancelOrder(
                        Long orderId,
                        String reason,
                        Long userId) {

                Order order = orderRepository
                                .findByIdAndUserId(orderId, userId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                // Cannot cancel after delivery has started
                if (order.getStatus() == OrderStatus.OUT_FOR_DELIVERY ||
                                order.getStatus() == OrderStatus.DELIVERED) {

                        throw new RuntimeException(
                                        "Order can no longer be cancelled");
                }

                order.setStatus(OrderStatus.CANCELLED);

                order.setCancellationReason(reason);

                order.setDeliveryPartnerId(null);

                return mapToResponse(
                                orderRepository.save(order));
        }

        // =====================================================
        // UPDATE ORDER STATUS
        // =====================================================

        @Transactional
        public OrderResponse updateOrderStatus(
                        Long orderId,
                        String status) {

                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                OrderStatus orderStatus;

                try {

                        orderStatus = OrderStatus.valueOf(
                                        status.toUpperCase());

                } catch (IllegalArgumentException e) {

                        throw new RuntimeException(
                                        "Invalid order status: " + status);
                }

                order.setStatus(orderStatus);

                return mapToResponse(
                                orderRepository.save(order));
        }

        // =====================================================
        // GET ALL ORDERS - ADMIN
        // =====================================================

        @Transactional(readOnly = true)
        public List<OrderResponse> getAllOrders() {

                return orderRepository.findAll()
                                .stream()
                                .map(this::mapToResponse)
                                .toList();
        }

        // =====================================================
        // MAP ORDER → RESPONSE
        // =====================================================

        private OrderResponse mapToResponse(Order order) {

                List<OrderItemResponse> itemResponses = order.getItems()
                                .stream()
                                .map(item -> {

                                        OrderItemResponse response = new OrderItemResponse();

                                        response.setProductId(
                                                        item.getProductId());

                                        response.setProductName(
                                                        item.getProductName());

                                        response.setPrice(
                                                        item.getPrice());

                                        response.setQuantity(
                                                        item.getQuantity());

                                        response.setSubtotal(
                                                        item.getSubtotal());

                                        response.setImage(
                                                        item.getProductImage());

                                        return response;
                                })
                                .toList();

                OrderResponse response = new OrderResponse();

                response.setOrderId(order.getId());

                response.setUserId(order.getUserId());

                response.setDeliveryPartnerId(
                                order.getDeliveryPartnerId());

                response.setTotalAmount(
                                order.getTotalAmount());

                response.setStatus(
                                order.getStatus().name());

                response.setOrderDate(
                                order.getOrderDate().toString());

                response.setItems(itemResponses);

                response.setCancelReason(
                                order.getCancellationReason());

                if (order.getDeliveredAt() != null) {

                        response.setDeliveredAt(
                                        order.getDeliveredAt().toString());
                }

                if (order.getPaymentMethod() != null) {
                        response.setPaymentMethod(
                                        order.getPaymentMethod().name());
                }

                if (order.getPaymentStatus() != null) {
                        response.setPaymentStatus(
                                        order.getPaymentStatus().name());
                }

                return response;
        }
}