package service;

import model.CartItem;
import model.User;
import java.util.List;

public interface CartService {
    List<CartItem> getCartItems(User user);
    CartItem addToCart(User user, Long productId, int quantity);
    void removeFromCart(Long cartItemId);
    void clearCart(User user);
    double getCartTotal(User user);
}
