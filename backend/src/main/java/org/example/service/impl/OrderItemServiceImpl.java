package org.example.service.impl;


import org.example.entity.Product;
import org.example.entity.User;
import org.example.exception.NotFoundException;
import org.example.mapper.EntityDtoMapper;
import org.example.repository.OrderItemRepo;
import org.example.repository.OrderRepo;
import org.example.repository.ProductRepo;
import org.example.service.interf.UserService;
import org.example.dto.OrderDto;
import org.example.dto.OrderItemDto;
import org.example.dto.OrderRequest;
import org.example.dto.Response;
import org.example.entity.Order;
import org.example.entity.OrderItem;
import org.example.enums.OrderStatus;
import org.example.service.interf.OrderItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderItemServiceImpl implements OrderItemService {


    private final OrderRepo orderRepo;
    private final OrderItemRepo orderItemRepo;
    private final ProductRepo productRepo;
    private final UserService userService;
    private final EntityDtoMapper entityDtoMapper;


    @Override
    public Response placeOrder(OrderRequest orderRequest) {

        User user = userService.getLoginUser();
        
        // Check if user is admin - admins cannot place orders
        if (user.getRole() == org.example.enums.UserRole.ADMIN || user.getRole() == org.example.enums.UserRole.NORMAL_ADMIN) {
            return Response.builder()
                    .status(403)
                    .message("Admin accounts cannot place orders")
                    .build();
        }
        
        //map order request items to order entities

        List<OrderItem> orderItems = orderRequest.getItems().stream().map(orderItemRequest -> {
            Product product = productRepo.findById(orderItemRequest.getProductId())
                    .orElseThrow(()-> new NotFoundException("Product Not Found"));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(orderItemRequest.getQuantity());
            orderItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(orderItemRequest.getQuantity()))); //set price according to the quantity
            orderItem.setUser(user);
            return orderItem;

        }).collect(Collectors.toList());

        //calculate the total price
        BigDecimal totalPrice = orderRequest.getTotalPrice() != null && orderRequest.getTotalPrice().compareTo(BigDecimal.ZERO) > 0
                ? orderRequest.getTotalPrice()
                : orderItems.stream().map(OrderItem::getPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

        //create order entity
        Order order = new Order();
        order.setOrderItemList(orderItems);
        order.setTotalPrice(totalPrice);
        order.setStatus(OrderStatus.PENDING); // Set status at Order level

        //set the order reference in each orderitem
        orderItems.forEach(orderItem -> orderItem.setOrder(order));

        orderRepo.save(order);

        return Response.builder()
                .status(200)
                .message("Order was successfully placed")
                .build();

    }

    @Override
    public Response updateOrderItemStatus(Long orderItemId, String status) {
        OrderItem orderItem = orderItemRepo.findById(orderItemId)
                .orElseThrow(()-> new NotFoundException("Order Item not found"));

        // Update status at Order level
        Order order = orderItem.getOrder();
        if (order != null) {
            order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
            orderRepo.save(order);
        }
        
        return Response.builder()
                .status(200)
                .message("Order status updated successfully")
                .build();
    }

    @Override
    public Response filterOrderItems(OrderStatus status, LocalDateTime startDate, LocalDateTime endDate, Long itemId, Pageable pageable) {
        // Filter by Order status instead of OrderItem status
        List<Order> orders;
        if (status != null) {
            orders = orderRepo.findAll().stream()
                    .filter(order -> order.getStatus() == status)
                    .collect(Collectors.toList());
        } else {
            orders = orderRepo.findAll();
        }

        // Filter by date range
        if (startDate != null || endDate != null) {
            orders = orders.stream()
                    .filter(order -> {
                        if (startDate != null && endDate != null) {
                            return !order.getCreatedAt().isBefore(startDate) && !order.getCreatedAt().isAfter(endDate);
                        } else if (startDate != null) {
                            return !order.getCreatedAt().isBefore(startDate);
                        } else {
                            return !order.getCreatedAt().isAfter(endDate);
                        }
                    })
                    .collect(Collectors.toList());
        }

        // Filter by itemId if provided
        if (itemId != null) {
            orders = orders.stream()
                    .filter(order -> order.getOrderItemList().stream()
                            .anyMatch(item -> item.getId().equals(itemId)))
                    .collect(Collectors.toList());
        }

        // Convert to OrderItemDto list (flatten order items)
        List<OrderItemDto> orderItemDtos = orders.stream()
                .flatMap(order -> order.getOrderItemList().stream()
                        .map(item -> {
                            OrderItemDto dto = entityDtoMapper.mapOrderItemToDtoPlusProductAndUser(item);
                            // Ensure order info is set (mapper should handle this, but double-check)
                            if (dto.getOrder() == null) {
                                OrderDto orderDto = new OrderDto();
                                orderDto.setId(order.getId());
                                orderDto.setTotalPrice(order.getTotalPrice());
                                orderDto.setStatus(order.getStatus() != null ? order.getStatus().name() : null);
                                orderDto.setCreatedAt(order.getCreatedAt());
                                dto.setOrder(orderDto);
                            }
                            return dto;
                        }))
                .collect(Collectors.toList());

        if (orderItemDtos.isEmpty()){
            throw new NotFoundException("No Order Found");
        }

        // Apply pagination manually
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), orderItemDtos.size());
        List<OrderItemDto> pagedDtos = orderItemDtos.subList(start, end);
        int totalPages = (int) Math.ceil((double) orderItemDtos.size() / pageable.getPageSize());

        return Response.builder()
                .status(200)
                .orderItemList(pagedDtos)
                .totalPage(totalPages)
                .totalElement((long) orderItemDtos.size())
                .build();
    }

    @Override
    public Response approveOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Check if order is in PENDING status
        if (order.getStatus() != OrderStatus.PENDING) {
            return Response.builder()
                    .status(400)
                    .message("Order can only be approved if it is in PENDING status")
                    .build();
        }

        // Update order status to APPROVED
        order.setStatus(OrderStatus.APPROVED);
        orderRepo.save(order);

        return Response.builder()
                .status(200)
                .message("Order approved successfully")
                .build();
    }

    @Override
    public Response rejectOrder(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Check if order is in PENDING status
        if (order.getStatus() != OrderStatus.PENDING) {
            return Response.builder()
                    .status(400)
                    .message("Order can only be rejected if it is in PENDING status")
                    .build();
        }

        // Update order status to REJECTED
        order.setStatus(OrderStatus.REJECTED);
        orderRepo.save(order);

        return Response.builder()
                .status(200)
                .message("Order rejected successfully")
                .build();
    }

    @Override
    public Response cancelOrder(Long orderId) {
        User user = userService.getLoginUser();
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Check if order belongs to user
        boolean belongsToUser = order.getOrderItemList().stream()
                .anyMatch(item -> item.getUser().getId().equals(user.getId()));

        if (!belongsToUser) {
            return Response.builder()
                    .status(403)
                    .message("You don't have permission to cancel this order")
                    .build();
        }

        // Check if order is in PENDING status
        if (order.getStatus() != OrderStatus.PENDING) {
            return Response.builder()
                    .status(400)
                    .message("Order can only be cancelled if it is in PENDING status")
                    .build();
        }

        // Update order status to CANCELLED
        order.setStatus(OrderStatus.CANCELLED);
        orderRepo.save(order);

        return Response.builder()
                .status(200)
                .message("Order cancelled successfully")
                .build();
    }

    @Override
    public Response getUserOrders() {
        User user = userService.getLoginUser();
        List<OrderItem> orderItems = orderItemRepo.findByUserId(user.getId());

        // Group by order and map with order info
        List<OrderItemDto> orderItemDtos = orderItems.stream()
                .map(item -> {
                    OrderItemDto dto = entityDtoMapper.mapOrderItemToDtoPlusProductAndUser(item);
                    // Add order information
                    if (item.getOrder() != null) {
                        OrderDto orderDto = new OrderDto();
                        orderDto.setId(item.getOrder().getId());
                        orderDto.setTotalPrice(item.getOrder().getTotalPrice());
                        orderDto.setStatus(item.getOrder().getStatus() != null ? item.getOrder().getStatus().name() : null);
                        orderDto.setCreatedAt(item.getOrder().getCreatedAt());
                        dto.setOrder(orderDto);
                    }
                    return dto;
                })
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .orderItemList(orderItemDtos)
                .message("User orders retrieved successfully")
                .build();
    }

    @Override
    public Response getOrderById(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setTotalPrice(order.getTotalPrice());
        orderDto.setStatus(order.getStatus() != null ? order.getStatus().name() : null);
        orderDto.setCreatedAt(order.getCreatedAt());
        
        // Map order items
        if (order.getOrderItemList() != null && !order.getOrderItemList().isEmpty()) {
            List<OrderItemDto> orderItemDtos = order.getOrderItemList().stream()
                    .map(item -> {
                        OrderItemDto dto = entityDtoMapper.mapOrderItemToDtoPlusProduct(item);
                        if (item.getUser() != null) {
                            dto.setUser(entityDtoMapper.mapUserToDtoPlusAddress(item.getUser()));
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());
            orderDto.setOrderItemList(orderItemDtos);
        }
        
        return Response.builder()
                .status(200)
                .order(orderDto)
                .message("Order retrieved successfully")
                .build();
    }

    @Override
    public Response updateOrderStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        
        try {
            OrderStatus newStatus = OrderStatus.valueOf(status.toUpperCase());
            order.setStatus(newStatus);
            orderRepo.save(order);
            
            return Response.builder()
                    .status(200)
                    .message("Order status updated successfully")
                    .build();
        } catch (IllegalArgumentException e) {
            return Response.builder()
                    .status(400)
                    .message("Invalid order status: " + status)
                    .build();
        }
    }

}