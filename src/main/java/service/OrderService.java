package service;

import model.CartItem;
import model.Order;
import model.User;
import repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Transactional
    public Order placeOrder(User user) {
        List<CartItem> cartItems = cartService.getCartItems(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty!");
        }

        Double total = cartService.getCartTotal(user);

        // Create Order
        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(total);

        // Assign this order to each CartItem
        for (CartItem item : cartItems) {
            item.setOrder(order);
        }

        // Set items list in order
        order.setItems(cartItems);

        // Save order (cascades to CartItems)
        Order savedOrder = orderRepository.save(order);

        // Clear cart after placing order
        cartService.clearCart(user);

        return savedOrder;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }
}