package com.ecommerce.shoplite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.ReturnRequest;
import com.ecommerce.shoplite.entity.User;

public interface ReturnRequestRepository
                extends JpaRepository<ReturnRequest, Long> {

        List<ReturnRequest> findByUserOrderByRequestedDateDesc(
                        User user);

        List<ReturnRequest> findByPickupPartnerOrderByRequestedDateDesc(
                        User pickupPartner);
}