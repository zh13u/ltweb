package org.example.controller;

import org.example.dto.OrderRequest;
import org.example.dto.Response;
import org.example.enums.OrderStatus;
import org.example.service.interf.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    @PostMapping("/create")
    public ResponseEntity<Response> placeOrder(@RequestBody OrderRequest orderRequest){
        return ResponseEntity.ok(orderItemService.placeOrder(orderRequest));
    }

    @PutMapping("/update-item-status/{orderItemId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> updateOrderItemStatus(@PathVariable Long orderItemId,  @RequestParam String status){
        return ResponseEntity.ok(orderItemService.updateOrderItemStatus(orderItemId, status));
    }

    @PutMapping("/approve/{orderId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> approveOrder(@PathVariable Long orderId){
        return ResponseEntity.ok(orderItemService.approveOrder(orderId));
    }

    @PutMapping("/reject/{orderId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> rejectOrder(@PathVariable Long orderId){
        return ResponseEntity.ok(orderItemService.rejectOrder(orderId));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> filterOrderItems(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)LocalDateTime endDate,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long itemId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "1000") int size

    ){
        // Default to PENDING status and sort by createdAt ASC (oldest first)
        OrderStatus orderStatus = status != null ? OrderStatus.valueOf(status.toUpperCase()) : OrderStatus.PENDING;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));

        return ResponseEntity.ok(orderItemService.filterOrderItems(orderStatus, startDate, endDate, itemId, pageable));

    }

    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<Response> cancelOrder(@PathVariable Long orderId){
        return ResponseEntity.ok(orderItemService.cancelOrder(orderId));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<Response> getUserOrders(){
        return ResponseEntity.ok(orderItemService.getUserOrders());
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> getOrderById(@PathVariable Long orderId){
        return ResponseEntity.ok(orderItemService.getOrderById(orderId));
    }

    @PutMapping("/update-status/{orderId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status){
        return ResponseEntity.ok(orderItemService.updateOrderStatus(orderId, status));
    }

}