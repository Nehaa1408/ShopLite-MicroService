package com.ecommerce.shoplite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.shoplite.entity.Message;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {


    List<Message> findByTicket_Id(Long ticketId);
}