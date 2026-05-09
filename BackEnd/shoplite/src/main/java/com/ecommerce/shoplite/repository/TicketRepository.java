package com.ecommerce.shoplite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.Ticket;
import com.ecommerce.shoplite.entity.User;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByUser(User user);

    List<Ticket> findByUser_Id(Long userId);

    long countByStatus(String status);
}