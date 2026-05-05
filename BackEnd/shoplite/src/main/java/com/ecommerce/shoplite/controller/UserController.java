
package com.ecommerce.shoplite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.shoplite.entity.Role;
import com.ecommerce.shoplite.entity.User;
import com.ecommerce.shoplite.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // GET ALL USERS (for assigning delivery)
    @GetMapping("/delivery")
    public List<User> getDeliveryUsers() {
        return userRepository.findByRole(Role.DELIVERY);
    }
}