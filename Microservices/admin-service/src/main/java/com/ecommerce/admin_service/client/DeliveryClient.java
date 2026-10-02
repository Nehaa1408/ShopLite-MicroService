package com.ecommerce.admin_service.client;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import com.ecommerce.admin_service.dto.DeliveryPartnerResponse;

@FeignClient(name = "DELIVERY-SERVICE")
public interface DeliveryClient {

    @GetMapping("/api/delivery/admin/pending")
    List<DeliveryPartnerResponse> getPendingPartners();

    @PutMapping("/api/delivery/admin/approve/{id}")
    DeliveryPartnerResponse approvePartner(
            @PathVariable Long id
    );

    @PutMapping("/api/delivery/admin/reject/{id}")
    DeliveryPartnerResponse rejectPartner(
            @PathVariable Long id
    );
}