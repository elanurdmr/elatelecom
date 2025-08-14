import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Orders.css';

const Orders = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa mock data göster
    if (!user || !token) {
      // Mock orders for demo
      const mockOrders = [
        {
          id: '1',
          orderNumber: 'ORD-12345678',
          status: 'PENDING',
          total: 89999,
          createdAt: new Date().toISOString(),
          items: [
            {
              productName: 'iPhone 15 Pro',
              quantity: 1,
              price: 89999,
              total: 89999
            }
          ],
          shippingAddress: 'Sample Address',
          shippingCity: 'Istanbul',
          shippingPostalCode: '34000',
          shippingCountry: 'Turkey',
          shippingPhone: '+90 555 123 4567'
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [user, token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'CONFIRMED': return '#17a2b8';
      case 'PROCESSING': return '#007bff';
      case 'SHIPPED': return '#28a745';
      case 'DELIVERED': return '#6c757d';
      case 'CANCELLED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track your order status and view order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here!</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card" onClick={() => openOrderDetails(order)}>
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="order-summary">
                <div className="order-items">
                  <p>{order.items.length} item(s)</p>
                  <p className="order-total">Total: ${order.total.toFixed(2)}</p>
                </div>
                <div className="order-actions">
                  <button className="btn-view-details">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeOrderDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedOrder.orderNumber}</h2>
              <button className="modal-close" onClick={closeOrderDetails}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="order-details-section">
                <h3>Order Information</h3>
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span>Status:</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Order Total:</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="order-details-section">
                <h3>Shipping Information</h3>
                <div className="detail-row">
                  <span>Address:</span>
                  <span>{selectedOrder.shippingAddress}</span>
                </div>
                <div className="detail-row">
                  <span>City:</span>
                  <span>{selectedOrder.shippingCity}</span>
                </div>
                <div className="detail-row">
                  <span>Postal Code:</span>
                  <span>{selectedOrder.shippingPostalCode}</span>
                </div>
                <div className="detail-row">
                  <span>Country:</span>
                  <span>{selectedOrder.shippingCountry}</span>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <span>{selectedOrder.shippingPhone}</span>
                </div>
              </div>

              <div className="order-details-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <img src={item.productImage || '/placeholder-product.jpg'} alt={item.productName} />
                      <div className="item-info">
                        <h4>{item.productName}</h4>
                        <p>Quantity: {item.quantity}</p>
                        <p className="item-price">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="item-total">
                        ${item.total.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="order-details-section">
                  <h3>Order Notes</h3>
                  <p className="order-notes">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
