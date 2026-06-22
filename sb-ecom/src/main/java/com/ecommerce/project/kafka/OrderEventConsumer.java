package com.ecommerce.project.kafka;

import com.ecommerce.project.payload.kafka.OrderEvent;
import com.ecommerce.project.payload.kafka.PaymentEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventConsumer.class);

    // Listens to order-events topic
    @KafkaListener(
            topics = "order-events",
            groupId = "shopnest-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeOrderEvent(OrderEvent event) {
        log.info("=== ORDER EVENT RECEIVED ===");
        log.info("Order ID    : {}", event.getOrderId());
        log.info("Customer    : {}", event.getEmail());
        log.info("Amount      : ₹{}", event.getTotalAmount());
        log.info("Status      : {}", event.getOrderStatus());
        log.info("Payment     : {}", event.getPaymentMethod());
        log.info("Timestamp   : {}", event.getTimestamp());
        log.info("===========================");

        // In a real microservices setup, this would be a separate service.
        // Here we simulate what downstream services would do:

        // 1. Email Service — send order confirmation email
        sendOrderConfirmationEmail(event);

        // 2. Analytics Service — record order for reporting
        recordOrderAnalytics(event);
    }

    // Listens to payment-events topic
    @KafkaListener(
            topics = "payment-events",
            groupId = "shopnest-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumePaymentEvent(PaymentEvent event) {
        log.info("=== PAYMENT EVENT RECEIVED ===");
        log.info("Order ID    : {}", event.getOrderId());
        log.info("Customer    : {}", event.getEmail());
        log.info("Payment ID  : {}", event.getRazorpayPaymentId());
        log.info("Status      : {}", event.getPgStatus());
        log.info("Amount      : ₹{}", event.getAmount());
        log.info("==============================");

        // Simulate payment confirmation processing
        processPaymentConfirmation(event);
    }

    private void sendOrderConfirmationEmail(OrderEvent event) {
        // Simulate email sending (in production: use JavaMailSender or SendGrid)
        log.info("[EMAIL SERVICE] Sending order confirmation to {} for order #{}",
                event.getEmail(), event.getOrderId());
    }

    private void recordOrderAnalytics(OrderEvent event) {
        // Simulate analytics recording
        log.info("[ANALYTICS SERVICE] Recording order #{} — ₹{}",
                event.getOrderId(), event.getTotalAmount());
    }

    private void processPaymentConfirmation(PaymentEvent event) {
        log.info("[PAYMENT SERVICE] Confirmed payment {} for order #{}",
                event.getRazorpayPaymentId(), event.getOrderId());
    }
}