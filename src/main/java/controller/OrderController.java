package controller;

import model.Order;
import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ Place an order (checkout)
    @PostMapping("/place")
    public Order placeOrder(@RequestBody OrderRequest request) {
        User user = new User();
        user.setId(request.getUserId());
        return orderService.placeOrder(user);
    }

    // ✅ Get all orders for a specific user
    @GetMapping("/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);
        return orderService.getUserOrders(user);
    }

    // DTO (Data Transfer Object) for request body
    public static class OrderRequest {
        private Long userId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }
}
