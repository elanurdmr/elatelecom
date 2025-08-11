import React from 'react';
import { useAppContext } from '../context/AppContext';
import './Cart.css';

function Cart() {
  const { cartItems } = useAppContext();
  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <div className="cart-page">
      <h1>Sepetim</h1>
      {cartItems.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <div className="cart-table">
          {cartItems.map((item, idx) => (
            <div key={idx} className="cart-row">
              <div className="cart-thumb" />
              <div className="cart-info">
                <div className="name">{item.name}</div>
                <div className="price">{item.price} TL</div>
              </div>
              <div className="qty">x{item.quantity || 1}</div>
              <div className="line-total">{((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)} TL</div>
            </div>
          ))}
          <div className="cart-total">Toplam: {total.toFixed(2)} TL</div>
        </div>
      )}
    </div>
  );
}

export default Cart;
