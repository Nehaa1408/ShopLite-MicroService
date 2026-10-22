package com.ecommerce.admin_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.admin_service.client.DeliveryClient;
import com.ecommerce.admin_service.dto.DeliveryPartnerResponse;

@Service
public class AdminDeliveryService {

    private final DeliveryClient deliveryClient;

    public AdminDeliveryService(DeliveryClient deliveryClient) {
        this.deliveryClient = deliveryClient;
    }

    public List<DeliveryPartnerResponse> getPendingPartners() {
        return deliveryClient.getPendingPartners();
    }

    public DeliveryPartnerResponse approvePartner(Long id) {
        return deliveryClient.approvePartner(id);
    }

    public DeliveryPartnerResponse rejectPartner(Long id) {
        return deliveryClient.rejectPartner(id);
    }
}