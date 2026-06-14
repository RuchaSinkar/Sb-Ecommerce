package com.ecommerce.project.controller;

import com.ecommerce.project.exception.APIException;
import com.ecommerce.project.payload.APIResponse;
import com.ecommerce.project.service.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class RazorpayController {

    @Autowired
    private RazorpayService razorpayService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    /**
     * Step 1: Frontend calls this to create a Razorpay order before showing the payment modal.
     * Body: { "amount": 999.0, "currency": "INR", "receipt": "order_rcpt_123" }
     */
    @PostMapping("/create-razorpay-order")
    public ResponseEntity<Map<String, Object>> createRazorpayOrder(@RequestBody Map<String, Object> request) {
        try {
            double amount = Double.parseDouble(request.get("amount").toString());
            String currency = request.getOrDefault("currency", "INR").toString();
            String receipt = request.getOrDefault("receipt", "receipt_" + System.currentTimeMillis()).toString();

            Order razorpayOrder = razorpayService.createOrder(amount, currency, receipt);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", razorpayOrder.get("id"));
            response.put("amount", razorpayOrder.get("amount"));
            response.put("currency", razorpayOrder.get("currency"));
            response.put("keyId", razorpayKeyId);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RazorpayException e) {
            throw new APIException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    /**
     * Step 2: Frontend calls this after successful payment to verify the signature.
     * Body: { "razorpayOrderId": "...", "razorpayPaymentId": "...", "razorpaySignature": "..." }
     */
    @PostMapping("/verify")
    public ResponseEntity<APIResponse> verifyPayment(@RequestBody Map<String, String> request) {
        String razorpayOrderId = request.get("razorpayOrderId");
        String razorpayPaymentId = request.get("razorpayPaymentId");
        String razorpaySignature = request.get("razorpaySignature");

        boolean isValid = razorpayService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        if (isValid) {
            return new ResponseEntity<>(new APIResponse("Payment verified successfully.", true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new APIResponse("Payment verification failed.", false), HttpStatus.BAD_REQUEST);
        }
    }
}
