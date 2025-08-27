import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

function Cart() {
  const { cartItems, updateCartItemQuantity, removeCartItem } = useAuth();
  const navigate = useNavigate();

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeCartItem(productId);
      return;
    }
    updateCartItemQuantity(productId, newQuantity);
  };

  const handleRemoveFromCart = (productId) => {
    removeCartItem(productId);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  // Loading state is now implicitly handled by AuthContext's initial fetch and cartItems availability
  // No explicit `if (loading)` block needed here unless AuthContext exposes its loading state

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>Sepetim</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h2>Sepetiniz boş</h2>
          <p>Alışverişe başlamak için sepetinize ürün ekleyin!</p>
          <button onClick={() => navigate('/products')} className="btn-continue-shopping">
            Alışverişe Devam Et
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.productImage || '/placeholder-product.jpg'} alt={item.productName} />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.productName}</h3>
                  <p className="item-price">₺{item.productPrice.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ₺{(item.productPrice * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => handleRemoveFromCart(item.productId)}
                  className="btn-remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Sipariş Özeti</h3>
            <div className="summary-row">
              <span>Ara Toplam:</span>
              <span>₺{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Kargo:</span>
              <span>₺{cartItems.length > 0 ? 10 : 0}</span>
            </div>
            <div className="summary-row total">
              <span>Toplam:</span>
              <span>₺{(calculateTotal() + (cartItems.length > 0 ? 10 : 0)).toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="btn-checkout"
              disabled={cartItems.length === 0}
            >
              Ödeme Sayfasına Git
            </button>
            
            <button 
              onClick={() => navigate('/products')}
              className="btn-continue-shopping"
            >
              Alışverişe Devam Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
