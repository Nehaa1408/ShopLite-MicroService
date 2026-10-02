package com.ecommerce.shoplite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.shoplite.entity.Order;
import com.ecommerce.shoplite.entity.Transaction;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionId(String transactionId);
    Optional<Transaction> findByOrder(Order order);
    List<Transaction> findAllByOrderByPaidAtDesc();
}