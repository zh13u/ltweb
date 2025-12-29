package org.example.controller;

import org.example.dto.PaymentRequest;
import org.example.dto.Response;
import org.example.service.interf.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<Response> processPayment(@RequestBody PaymentRequest paymentRequest){
        return ResponseEntity.ok(paymentService.processPayment(paymentRequest));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Response> getPaymentByOrderId(@PathVariable Long orderId){
        return ResponseEntity.ok(paymentService.getPaymentByOrderId(orderId));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> getAllPayments(){
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/revenue-stats")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NORMAL_ADMIN')")
    public ResponseEntity<Response> getRevenueStats(@RequestParam(required = false, defaultValue = "all") String period){
        return ResponseEntity.ok(paymentService.getRevenueStats(period));
    }
}

