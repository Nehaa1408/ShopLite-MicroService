package com.ecommerce.admin_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TopProductResponse {

    private Long productId;
    private String productName;
    private int quantitySold;
    private double revenue;
    private String image;
}