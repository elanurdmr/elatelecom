import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/services/api';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getTranslatedStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Hazırlanıyor';
      case 'PROCESSING':
        return 'İşleniyor';
      case 'SHIPPED':
        return 'Yola Çıktı';
      case 'DELIVERED':
        return 'Teslim Edildi';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      setError('You must be logged in to view your orders.');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api('/orders/user', 'GET');
        setOrders(response);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  if (loading) {
    return <div className="orders-container">Loading orders...</div>;
  }

  if (error) {
    return <div className="orders-container error">Error: {error}</div>;
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <div className="orders-list">
          <h2>Tüm Siparişler ({orders.length})</h2>
          <p>Toplam Sipariş Tutarı: {orders.reduce((acc, order) => acc + order.total, 0).toFixed(2)} TL</p>
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>Order #{order.orderNumber}</h3>
              <p>Status: {getTranslatedStatus(order.status)}</p>
              <p>Total: {(order.total || 0).toFixed(2)} TL</p>
              <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <h4>Items:</h4>
              <ul>
                {order.orderItems && order.orderItems.map((item) => (
                  <li key={item.productId}>
                    {item.productName} (x{item.quantity}) - {item.price} TL
                  </li>
                ))}
              </ul>
              <button
                className="btn-track-order"
                onClick={() => navigate(`/order-tracking/${order.orderNumber}`)}
              >
                Sipariş Takip Et
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
