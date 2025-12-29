package org.example.repository;
import org.example.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long>, JpaSpecificationExecutor<OrderItem> {
    List<OrderItem> findByProductId(Long productId);
    List<OrderItem> findByUserId(Long userId);
}