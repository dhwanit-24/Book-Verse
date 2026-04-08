package com.example.demo.repository;

import com.example.demo.entity.OrderEntity;
import com.example.demo.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepo extends JpaRepository<OrderEntity, Integer> {

    // Find orders by user (for order history)
    List<OrderEntity> findByUserOrderByOrderDateDesc(UserEntity user);

    // Find orders by status (for admin)
    List<OrderEntity> findByStatus(String status);

    // Get sales between dates (for dashboard)
    List<OrderEntity> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    // Count orders by status
    long countByStatus(String status);

    // Sum of totalAmount for all orders (total revenue)
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM OrderEntity o")
    Double getTotalRevenue();

    // Sum of totalAmount between dates
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM OrderEntity o WHERE o.orderDate BETWEEN :start AND :end")
    Double getRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}