package com.ecommerce.project.payload.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEvent {
    private Long orderId;
    private String email;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String pgStatus;
    private Double amount;
    private LocalDateTime timestamp;
}
