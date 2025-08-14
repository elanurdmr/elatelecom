import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

function Cart() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa mock data göster
    if (!user || !token) {
      // Mock cart items for demo
      const mockCartItems = [
        {
          id: '1',
          productId: '1',
          productName: 'iPhone 15 Pro',
          productImage: '/placeholder-product.jpg',
          productPrice: 89999,
          quantity: 1
        }
      ];
      setCartItems(mockCartItems);
      setLoading(false);
      return;
    }
    fetchCartItems();
  }, [user, token, navigate]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cart/items', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const items = await response.json();
        setCartItems(items);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="btn-clear-cart">
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to get started!</p>
          <button onClick={() => navigate('/products')} className="btn-continue-shopping">
            Continue Shopping
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
                  <p className="item-price">${item.productPrice.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(item.productPrice * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeFromCart(item.productId)}
                  className="btn-remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${cartItems.length > 0 ? 10 : 0}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${(calculateTotal() + (cartItems.length > 0 ? 10 : 0)).toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="btn-checkout"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            
            <button 
              onClick={() => navigate('/products')}
              className="btn-continue-shopping"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
