package com.ecommerce.admin_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.ecommerce.admin_service.dto.OrderResponse;

@FeignClient(name = "ORDER-SERVICE")
public interface OrderClient {

    @GetMapping("/api/orders/admin")
    List<OrderResponse> getAllOrders();
}