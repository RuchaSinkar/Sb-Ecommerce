package com.ecommerce.project.controller;

import com.ecommerce.project.payload.OrderDTO;
import com.ecommerce.project.payload.OrderRequestDTO;
import com.ecommerce.project.service.AuthUtil;
import com.ecommerce.project.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthUtil authUtil;

    // Place an order (after Razorpay payment)
    @PostMapping("/order/users/payments/{paymentMethod}")
    public ResponseEntity<OrderDTO> orderProducts(@PathVariable String paymentMethod,
                                                  @RequestBody OrderRequestDTO orderRequestDTO) {
        String email = authUtil.loggedInEmail();
        OrderDTO orderDTO = orderService.placeOrder(
                email,
                orderRequestDTO.getAddressId(),
                paymentMethod,
                orderRequestDTO.getRazorpayPaymentId(),
                orderRequestDTO.getRazorpayOrderId(),
                orderRequestDTO.getRazorpaySignature(),
                orderRequestDTO.getPgName(),
                orderRequestDTO.getPgPaymentId(),
                orderRequestDTO.getPgStatus(),
                orderRequestDTO.getPgResponseMessage()
        );
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);
    }

    // Get current user's orders
    @GetMapping("/order/users/myOrders")
    public ResponseEntity<List<OrderDTO>> getMyOrders() {
        String email = authUtil.loggedInEmail();
        List<OrderDTO> orders = orderService.getOrdersByUser(email);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Get single order by id
    @GetMapping("/order/users/myOrders/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId) {
        String email = authUtil.loggedInEmail();
        OrderDTO order = orderService.getOrder(email, orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    // Admin: get all orders
    @GetMapping("/admin/orders")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // Admin: update order status
    @PutMapping("/admin/orders/{orderId}/orderStatus/{orderStatus}")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId,
                                                      @PathVariable String orderStatus) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(orderId, orderStatus);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }
}
