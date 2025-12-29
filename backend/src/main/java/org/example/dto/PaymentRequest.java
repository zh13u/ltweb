package org.example.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequest {
    private Long orderId;
    private BigDecimal amount;
    private String method; // "CASH", "BANK_TRANSFER", "CREDIT_CARD", etc.
}

