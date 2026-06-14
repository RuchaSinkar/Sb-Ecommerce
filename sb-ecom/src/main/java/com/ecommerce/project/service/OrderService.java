package com.ecommerce.project.service;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderRequestDTO;

import java.util.List;

public interface OrderService {

    OrderDTO placeOrder(String email, Long addressId, String paymentMethod,
                        String razorpayPaymentId, String razorpayOrderId,
                        String razorpaySignature, String pgName,
                        String pgPaymentId, String pgStatus, String pgResponseMessage);

    List<OrderDTO> getOrdersByUser(String email);

    OrderDTO getOrder(String email, Long orderId);

    List<OrderDTO> getAllOrders();

    OrderDTO updateOrderStatus(Long orderId, String orderStatus);
}
