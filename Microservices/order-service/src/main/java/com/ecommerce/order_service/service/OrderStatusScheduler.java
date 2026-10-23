
package com.ecommerce.order_service.service;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.order_service.entity.Order;
import com.ecommerce.order_service.entity.OrderStatus;
import com.ecommerce.order_service.repository.OrderRepository;

@Component
public class OrderStatusScheduler {

    private final OrderRepository orderRepository;

    public OrderStatusScheduler(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Scheduled(fixedDelay = 10000)
    @Transactional
    public void updatePlacedOrdersToPacked() {

        List<Order> orders = orderRepository.findAll()
                .stream()
                .filter(order -> order.getStatus() == OrderStatus.PLACED)
                .toList();

        for (Order order : orders) {
            order.setStatus(OrderStatus.PACKED);
        }

        if (!orders.isEmpty()) {
            orderRepository.saveAll(orders);
        }
    }
}
