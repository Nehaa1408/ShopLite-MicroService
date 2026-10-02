package com.ecommerce.admin_service.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ecommerce.admin_service.client.OrderClient;
import com.ecommerce.admin_service.dto.DashboardStatsResponse;
import com.ecommerce.admin_service.dto.OrderItemResponse;
import com.ecommerce.admin_service.dto.OrderResponse;
import com.ecommerce.admin_service.dto.TopProductResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderClient orderClient;

    public DashboardStatsResponse getDashboardStats() {

        List<OrderResponse> orders = orderClient.getAllOrders();

        long totalOrders = orders.size();

        long pendingOrders = orders.stream()
                .filter(order -> "PENDING".equalsIgnoreCase(order.getStatus()))
                .count();

        long deliveredOrders = orders.stream()
                .filter(order -> "DELIVERED".equalsIgnoreCase(order.getStatus()))
                .count();

        long cancelledOrders = orders.stream()
                .filter(order -> "CANCELLED".equalsIgnoreCase(order.getStatus()))
                .count();

        double totalRevenue = orders.stream()
                .filter(order -> !"CANCELLED".equalsIgnoreCase(order.getStatus()))
                .mapToDouble(OrderResponse::getTotalAmount)
                .sum();

        return new DashboardStatsResponse(
                totalOrders,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                totalRevenue
        );
    }

    public List<OrderResponse> getRecentOrders() {

        List<OrderResponse> orders = orderClient.getAllOrders();

        return orders.stream()
                .sorted((o1, o2) -> o2.getOrderDate()
                .compareTo(o1.getOrderDate()))
                .limit(5)
                .toList();
    }

    public List<TopProductResponse> getTopProducts() {

        List<OrderResponse> orders = orderClient.getAllOrders();

        Map<Long, List<OrderItemResponse>> productGroups = orders.stream()
                .filter(order -> !"CANCELLED".equalsIgnoreCase(order.getStatus()))
                .filter(order -> order.getItems() != null)
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                        OrderItemResponse::getProductId
                ));

        return productGroups.entrySet()
                .stream()
                .map(entry -> {

                    Long productId = entry.getKey();
                    List<OrderItemResponse> items = entry.getValue();

                    int quantitySold = items.stream()
                            .mapToInt(OrderItemResponse::getQuantity)
                            .sum();

                    double revenue = items.stream()
                            .mapToDouble(OrderItemResponse::getSubtotal)
                            .sum();

                    OrderItemResponse firstItem = items.get(0);

                    return new TopProductResponse(
                            productId,
                            firstItem.getProductName(),
                            quantitySold,
                            revenue,
                            firstItem.getImage()
                    );
                })
                .sorted(Comparator
                        .comparingInt(TopProductResponse::getQuantitySold)
                        .reversed())
                .limit(5)
                .toList();
    }
}
