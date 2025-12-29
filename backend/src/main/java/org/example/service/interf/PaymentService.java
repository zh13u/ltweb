package org.example.service.interf;

import org.example.dto.PaymentRequest;
import org.example.dto.Response;

public interface PaymentService {
    Response processPayment(PaymentRequest paymentRequest);
    Response getPaymentByOrderId(Long orderId);
    Response getAllPayments();
    Response getRevenueStats(String period); // period: "day", "week", "month"
}

