package com.ecommerce.project.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne(mappedBy = "payment", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Order order;

    private String paymentMethod;

    // Razorpay fields
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private String pgName;
    private String pgPaymentId;
    private String pgStatus;
    private String pgResponseMessage;

    public Payment(String paymentMethod, String razorpayPaymentId,
                   String razorpayOrderId, String razorpaySignature,
                   String pgName, String pgPaymentId,
                   String pgStatus, String pgResponseMessage) {
        this.paymentMethod = paymentMethod;
        this.razorpayPaymentId = razorpayPaymentId;
        this.razorpayOrderId = razorpayOrderId;
        this.razorpaySignature = razorpaySignature;
        this.pgName = pgName;
        this.pgPaymentId = pgPaymentId;
        this.pgStatus = pgStatus;
        this.pgResponseMessage = pgResponseMessage;
    }
}
