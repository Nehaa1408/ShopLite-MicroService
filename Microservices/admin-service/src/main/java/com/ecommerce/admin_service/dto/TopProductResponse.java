package com.ecommerce.admin_service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TopProductResponse {

    private Long productId;
    private String productName;
    private int quantitySold;
    private double revenue;
    private String image;

    public TopProductResponse(Long productId, String productName, int quantitySold, double revenue, String image) {
        this.productId = productId;
        this.productName = productName;
        this.quantitySold = quantitySold;
        this.revenue = revenue;
        this.image = image;
    }
}