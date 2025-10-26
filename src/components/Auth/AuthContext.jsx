import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Temporary user credentials (remove later)
const TEMP_USER = {
  email: 'test@cinnamonmiracle.com',
  password: 'test123',
  firstName: 'Test',
  lastName: 'User',
  mobile: '0771234567'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  const login = (email, password) => {
    if (email === TEMP_USER.email && password === TEMP_USER.password) {
      setUser({
        email: TEMP_USER.email,
        firstName: TEMP_USER.firstName,
        lastName: TEMP_USER.lastName,
        mobile: TEMP_USER.mobile
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const signup = (userData) => {
    setUser({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobile: userData.mobile
    });
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product, quantity, orderType) => {
    const existingItem = cart.find(item => 
      item.id === product.id && item.orderType === orderType
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id && item.orderType === orderType
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        quantity, 
        orderType,
        addedAt: new Date()
      }]);
    }
  };

  const removeFromCart = (productId, orderType) => {
    setCart(cart.filter(item => 
      !(item.id === productId && item.orderType === orderType)
    ));
  };

  const updateCartQuantity = (productId, orderType, quantity) => {
    setCart(cart.map(item =>
      item.id === productId && item.orderType === orderType
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.orderType === 'bulk' ? item.price * 0.9 : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AuthContext.Provider value={{
      user,
      cart,
      login,
      signup,
      logout,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};