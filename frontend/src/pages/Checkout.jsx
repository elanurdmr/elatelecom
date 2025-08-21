import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
  const { user, token, cartItems } = useAuth(); // Get cartItems from AuthContext
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingCountry: 'Turkey',
    shippingPhone: '',
    notes: ''
  });

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }
    // No need to fetch cart items here, as they are already available from AuthContext
  }, [user, token, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  const calculateShipping = () => {
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    if (totalItems <= 3) return 10;
    if (totalItems <= 10) return 15;
    return 20;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/orders/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const order = await response.json();
        alert(`Order created successfully! Order number: ${order.orderNumber}`);
        navigate('/orders');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to create order'}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart before checkout.</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="checkout-form-section">
          <h2>Checkout</h2>
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="shippingAddress">Shipping Address</label>
              <input
                type="text"
                id="shippingAddress"
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                required
                placeholder="Enter your shipping address"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="shippingCity">City</label>
                <input
                  type="text"
                  id="shippingCity"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label htmlFor="shippingPostalCode">Postal Code</label>
                <input
                  type="text"
                  id="shippingPostalCode"
                  name="shippingPostalCode"
                  value={formData.shippingPostalCode}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter postal code"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="shippingCountry">Country</label>
                <select
                  id="shippingCountry"
                  name="shippingCountry"
                  value={formData.shippingCountry}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Turkey">Turkey</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="shippingPhone">Phone</label>
                <input
                  type="tel"
                  id="shippingPhone"
                  name="shippingPhone"
                  value={formData.shippingPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Order Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any special instructions or notes for your order"
                rows="3"
              />
            </div>

            <button type="submit" className="btn-checkout" disabled={loading}>
              {loading ? 'Processing...' : `Place Order - ₺${calculateTotal().toFixed(2)}`}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.productImage || '/placeholder-product.jpg'} alt={item.productName} />
                <div className="item-details">
                  <h4>{item.productName}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p className="item-price">₺{item.productPrice.toFixed(2)}</p>
                </div>
                <div className="item-total">
                  ₺{(item.productPrice * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₺{calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>₺{calculateShipping().toFixed(2)}</span>
            </div>
            <div className="total-row total">
              <span>Total:</span>
              <span>₺{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
