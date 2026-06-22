package com.ecommerce.project.kafka;

import com.ecommerce.project.payload.kafka.OrderEvent;
import com.ecommerce.project.payload.kafka.PaymentEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
public class OrderEventProducer {

    private static final Logger log = LoggerFactory.getLogger(OrderEventProducer.class);

    private static final String ORDER_TOPIC   = "order-events";
    private static final String PAYMENT_TOPIC = "payment-events";

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderEvent(OrderEvent event) {
        log.info("Publishing order event for orderId: {}", event.getOrderId());
        CompletableFuture<SendResult<String, Object>> future =
                kafkaTemplate.send(ORDER_TOPIC, String.valueOf(event.getOrderId()), event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish order event for orderId: {}", event.getOrderId(), ex);
            } else {
                log.info("Order event published successfully — orderId: {}, partition: {}, offset: {}",
                        event.getOrderId(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }

    public void publishPaymentEvent(PaymentEvent event) {
        log.info("Publishing payment event for orderId: {}", event.getOrderId());
        CompletableFuture<SendResult<String, Object>> future =
                kafkaTemplate.send(PAYMENT_TOPIC, String.valueOf(event.getOrderId()), event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish payment event for orderId: {}", event.getOrderId(), ex);
            } else {
                log.info("Payment event published — orderId: {}, offset: {}",
                        event.getOrderId(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}