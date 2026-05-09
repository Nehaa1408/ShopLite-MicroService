package com.ecommerce.shoplite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.DeliveryPartnerRepository;
import com.ecommerce.shoplite.entity.DeliveryPartner;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private DeliveryPartnerRepository deliveryPartnerRepository;

    // GET DELIVERY USERS
    @GetMapping("/delivery")
    public List<User> getDeliveryUsers() {

        return deliveryPartnerRepository
                .findByApprovedTrue()
                .stream()
                .map(DeliveryPartner::getUser)
                .toList();
    }
}