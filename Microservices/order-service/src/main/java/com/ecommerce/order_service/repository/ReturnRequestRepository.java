package com.ecommerce.order_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.order_service.entity.ReturnRequest;

public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {

    List<ReturnRequest> findByUserIdOrderByRequestedDateDesc(Long userId);

    List<ReturnRequest> findByPickupPartnerIdOrderByRequestedDateDesc(Long pickupPartnerId);
}