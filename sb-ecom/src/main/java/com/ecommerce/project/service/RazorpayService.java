package com.ecommerce.project.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HexFormat;

@Service
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    /**
     * Creates a Razorpay order.
     * @param amount  amount in paise (INR * 100)
     * @param currency currency code e.g. "INR"
     * @param receipt any unique receipt string
     * @return Razorpay Order object (has .get("id") for razorpayOrderId)
     */
    public Order createOrder(double amount, String currency, String receipt) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        JSONObject options = new JSONObject();
        options.put("amount", (int)(amount * 100));  // convert to paise
        options.put("currency", currency);
        options.put("receipt", receipt);
        options.put("payment_capture", 1);
        return client.orders.create(options);
    }

    /**
     * Verifies Razorpay payment signature.
     * @param razorpayOrderId   the order id returned by Razorpay
     * @param razorpayPaymentId the payment id from the frontend callback
     * @param razorpaySignature the signature from the frontend callback
     * @return true if signature is valid
     */
    public boolean verifySignature(String razorpayOrderId,
                                   String razorpayPaymentId,
                                   String razorpaySignature) {
        try {
            String payload = razorpayOrderId + "|" + razorpayPaymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(keySecret.getBytes(), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hash = mac.doFinal(payload.getBytes());
            String generated = HexFormat.of().formatHex(hash);
            return generated.equals(razorpaySignature);
        } catch (Exception e) {
            throw new RuntimeException("Signature verification failed: " + e.getMessage());
        }
    }
}
