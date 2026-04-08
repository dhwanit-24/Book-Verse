package com.example.demo.repository;

import com.example.demo.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItemEntity, Integer> {

    // Find items by order ID
    List<OrderItemEntity> findByOrderId(Integer orderId);

    // Top selling books (for dashboard)
    @Query("SELECT oi.book.id, oi.book.title, SUM(oi.quantity) as totalSold " +
           "FROM OrderItemEntity oi " +
           "GROUP BY oi.book.id, oi.book.title " +
           "ORDER BY totalSold DESC")
    List<Object[]> findTopSellingBooks();

    // Top buyers (users with highest total spend)
    @Query("SELECT o.user.id, o.user.name, o.user.email, SUM(o.totalAmount) as totalSpent " +
           "FROM OrderEntity o " +
           "GROUP BY o.user.id, o.user.name, o.user.email " +
           "ORDER BY totalSpent DESC")
    List<Object[]> findTopBuyers();
}