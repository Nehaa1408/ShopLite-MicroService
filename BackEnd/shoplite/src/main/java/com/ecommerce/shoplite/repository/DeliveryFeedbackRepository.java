package com.ecommerce.shoplite.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.DeliveryFeedback;
import com.ecommerce.shoplite.entity.Order;

public interface DeliveryFeedbackRepository
        extends JpaRepository<DeliveryFeedback, Long> {

    // CHECK EXISTING FEEDBACK
    Optional<DeliveryFeedback> findByOrder(Order order);
}