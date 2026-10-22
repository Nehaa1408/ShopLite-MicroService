package com.ecommerce.admin_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.admin_service.dto.DashboardStatsResponse;
import com.ecommerce.admin_service.dto.OrderResponse;
import com.ecommerce.admin_service.dto.TopProductResponse;
import com.ecommerce.admin_service.service.AdminDashboardService;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(AdminDashboardService adminDashboardService) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats() {

        return ResponseEntity.ok(
                adminDashboardService.getDashboardStats()
        );
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<OrderResponse>> getRecentOrders() {

        return ResponseEntity.ok(
                adminDashboardService.getRecentOrders()
        );
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<TopProductResponse>> getTopProducts() {

        return ResponseEntity.ok(
                adminDashboardService.getTopProducts()
        );
    }
}
