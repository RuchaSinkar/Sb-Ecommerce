package com.ecommerce.project.payload.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {
    private Long orderId;
    private String email;
    private Double totalAmount;
    private String orderStatus;
    private String paymentMethod;
    private LocalDateTime timestamp;
}
