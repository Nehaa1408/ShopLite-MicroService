package com.ecommerce.order_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.order_service.entity.DeliveryFeedback;

public interface DeliveryFeedbackRepository
        extends JpaRepository<DeliveryFeedback, Long> {

    Optional<DeliveryFeedback> findByOrderId(Long orderId);
}