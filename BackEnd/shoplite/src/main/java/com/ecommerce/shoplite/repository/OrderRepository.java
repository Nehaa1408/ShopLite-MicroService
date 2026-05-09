package com.ecommerce.shoplite.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ecommerce.shoplite.entity.Order;
import com.ecommerce.shoplite.entity.OrderStatus;
import com.ecommerce.shoplite.entity.Product;
import com.ecommerce.shoplite.entity.User;

import java.util.Optional;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserOrderByOrderDateDesc(User user);

    Optional<Order> findByIdAndUser(Long id, User user);

    List<Order> findByDeliveryAgentAndStatus(
            User deliveryAgent,
            OrderStatus status);

    // ================= TOP SELLING PRODUCTS =================
    @Query("""
                SELECT oi.product
                FROM Order o
                JOIN o.items oi
                GROUP BY oi.product
                ORDER BY SUM(oi.quantity) DESC
            """)
    List<Product> findTopSellingProducts(Pageable pageable);
}