package com.ecommerce.admin_service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DashboardStatsResponse {

    private long totalOrders;
    private long pendingOrders;
    private long deliveredOrders;
    private long cancelledOrders;
    private double totalRevenue;

    public DashboardStatsResponse(long totalOrders, long pendingOrders, long deliveredOrders,
                                  long cancelledOrders, double totalRevenue) {
        this.totalOrders = totalOrders;
        this.pendingOrders = pendingOrders;
        this.deliveredOrders = deliveredOrders;
        this.cancelledOrders = cancelledOrders;
        this.totalRevenue = totalRevenue;
    }
}
