import React from "react";

function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} className="cart-img" />
      <div className="cart-details">
        <h3>{item.name}</h3>
        <p>${item.price.toFixed(2)}</p>
        <div className="quantity-controls">
          <button onClick={() => onQuantityChange(item.id, -1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onQuantityChange(item.id, 1)}>+</button>
        </div>
      </div>
      <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
    </div>
  );
}

export default CartItem;
