package com.ecommerce.shoplite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.Role;
import com.ecommerce.shoplite.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

   List<User> findByRole(Role role);
}
