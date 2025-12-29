package org.example.service.impl;

import org.example.dto.PaymentRequest;
import org.example.dto.Response;
import org.example.entity.Order;
import org.example.entity.Payment;
import org.example.enums.OrderStatus;
import org.example.exception.NotFoundException;
import org.example.repository.OrderRepo;
import org.example.repository.PaymentRepo;
import org.example.service.interf.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepo paymentRepo;
    private final OrderRepo orderRepo;

    @Override
    @Transactional
    public Response processPayment(PaymentRequest paymentRequest) {
        // Get the order
        Order order = orderRepo.findById(paymentRequest.getOrderId())
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Check if order is approved
        if (order.getStatus() != OrderStatus.APPROVED) {
            return Response.builder()
                    .status(400)
                    .message("Order must be approved before payment can be processed")
                    .build();
        }

        // Check if payment already exists
        if (paymentRepo.findByOrderId(order.getId()).isPresent()) {
            return Response.builder()
                    .status(400)
                    .message("Payment already exists for this order")
                    .build();
        }

        // Validate payment amount
        if (paymentRequest.getAmount().compareTo(order.getTotalPrice()) != 0) {
            return Response.builder()
                    .status(400)
                    .message("Payment amount does not match order total")
                    .build();
        }

        // Create payment record
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setAmount(paymentRequest.getAmount());
        payment.setMethod(paymentRequest.getMethod() != null ? paymentRequest.getMethod() : "BANK_TRANSFER");
        payment.setStatus("SUCCESS");

        paymentRepo.save(payment);

        // Update order status to PAID
        order.setStatus(OrderStatus.PAID);
        orderRepo.save(order);

        return Response.builder()
                .status(200)
                .message("Payment processed successfully")
                .build();
    }

    @Override
    public Response getPaymentByOrderId(Long orderId) {
        paymentRepo.findByOrderId(orderId)
                .orElseThrow(() -> new NotFoundException("Payment not found for this order"));

        return Response.builder()
                .status(200)
                .message("Payment retrieved successfully")
                .build();
    }

    @Override
    public Response getAllPayments() {
        paymentRepo.findAll();

        return Response.builder()
                .status(200)
                .message("Payments retrieved successfully")
                .build();
    }

    @Override
    public Response getRevenueStats(String period) {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime startDate;
        java.math.BigDecimal totalRevenue = java.math.BigDecimal.ZERO;

        List<Payment> payments;

        switch (period != null ? period.toLowerCase() : "all") {
            case "day":
                startDate = now.withHour(0).withMinute(0).withSecond(0).withNano(0);
                payments = paymentRepo.findByCreatedAtBetween(startDate, now);
                break;
            case "week":
                startDate = now.minusDays(7);
                payments = paymentRepo.findByCreatedAtBetween(startDate, now);
                break;
            case "month":
                startDate = now.minusMonths(1);
                payments = paymentRepo.findByCreatedAtBetween(startDate, now);
                break;
            default:
                payments = paymentRepo.findAll();
                break;
        }

        // Calculate total revenue from successful payments
        totalRevenue = payments.stream()
                .filter(p -> "SUCCESS".equals(p.getStatus()))
                .map(Payment::getAmount)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return Response.builder()
                .status(200)
                .revenue(totalRevenue)
                .message("Revenue statistics retrieved successfully")
                .build();
    }
}

