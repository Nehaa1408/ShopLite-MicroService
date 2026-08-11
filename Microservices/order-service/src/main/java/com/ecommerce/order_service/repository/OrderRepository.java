package com.ecommerce.order_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderStatus;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get all orders belonging to a user
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    // Get a specific order belonging to a user
    Optional<Order> findByIdAndUserId(Long id, Long userId);

    // Get orders by delivery partner and status
    List<Order> findByDeliveryPartnerIdAndStatus(
            Long deliveryPartnerId,
            OrderStatus status
    );
}
