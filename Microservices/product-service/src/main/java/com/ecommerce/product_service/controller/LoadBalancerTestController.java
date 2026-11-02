package com.ecommerce.product_service.controller;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoadBalancerTestController {

    @GetMapping("/internal/load-balancer-test")
    public Map<String, String> testLoadBalancing() throws UnknownHostException {
        return Map.of(
                "service", "PRODUCT-SERVICE",
                "instance", InetAddress.getLocalHost().getHostName());
    }

}
