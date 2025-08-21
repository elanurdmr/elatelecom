import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/services/api';
import { FaTruck, FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa';
import './OrderTracking.css';

function OrderTracking() {
  const { orderId: paramOrderId } = useParams(); // URL'den sipariş ID'sini al
  const [orderNumber] = useState('DEMO123'); // setOrderNumber is not used
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderStatus = async (currentOrderId) => {
    // If no specific order ID is provided, use a hardcoded demo order
    if (!currentOrderId || currentOrderId === 'DEMO123') {
      setOrderStatus({
        orderNumber: 'DEMO123',
        status: 'SHIPPED', // You can change this to PENDING, PROCESSING, DELIVERED
        orderDate: new Date().toISOString(),
        totalPrice: 150.75,
        orderItems: [
          { productId: 'prod1', productName: 'Demo Ürün 1', quantity: 1, price: 100.00 },
          { productId: 'prod2', productName: 'Demo Ürün 2', quantity: 2, price: 25.375 }
        ],
        shippingAddress: 'Demo Adres Mah. Demo Cad. No:123',
        shippingCity: 'Demo Şehir',
        shippingPostalCode: '34000',
        shippingCountry: 'Turkey',
      });
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api(`/orders/number/${currentOrderId}`, 'GET');
      setOrderStatus(response);
    } catch (err) {
      console.error('Error fetching order status:', err);
      setError('Sipariş durumu yüklenirken bir hata oluştu. Lütfen sipariş numarasını kontrol edin.');
      setOrderStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus(paramOrderId || orderNumber); // Use paramOrderId or default demo order number
  }, [paramOrderId, orderNumber]);

  const getStatusStep = (status) => {
    switch (status) {
      case 'PENDING':
        return 1;
      case 'PROCESSING':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="order-tracking-container">
      <h2>Sipariş Takibi</h2>

      {loading && <div className="loading">Sipariş durumu yükleniyor...</div>}
      {error && <div className="error-message">{error}</div>}

      {orderStatus && (
        <div className="tracking-details">
          <h3>Sipariş #{orderStatus.orderNumber}</h3>
          <p>Durum: <span className="current-status">{orderStatus.status}</span></p>

          <div className="tracking-timeline">
            <div className={`timeline-step ${getStatusStep(orderStatus.status) >= 1 ? 'active' : ''}`}>
              <FaBox className="icon" />
              <span>Sipariş Alındı</span>
            </div>
            <div className="timeline-line"></div>
            <div className={`timeline-step ${getStatusStep(orderStatus.status) >= 2 ? 'active' : ''}`}>
              <FaTruck className="icon" />
              <span>Hazırlanıyor</span>
            </div>
            <div className="timeline-line"></div>
            <div className={`timeline-step ${getStatusStep(orderStatus.status) >= 3 ? 'active' : ''}`}>
              <FaShippingFast className="icon" />
              <span>Yola Çıktı</span>
            </div>
            <div className="timeline-line"></div>
            <div className={`timeline-step ${getStatusStep(orderStatus.status) >= 4 ? 'active' : ''}`}>
              <FaCheckCircle className="icon" />
              <span>Teslim Edildi</span>
            </div>
          </div>

          <div className="delivery-truck-animation">
            <FaTruck className="delivery-truck" />
          </div>

          <p className="order-date">Sipariş Tarihi: {new Date(orderStatus.orderDate).toLocaleDateString()}</p>
          <p className="order-total">Toplam Tutar: ₺{(orderStatus.totalPrice || 0).toFixed(2)}</p>
          <h4>Sipariş İçeriği:</h4>
          <ul className="order-items-list">
            {orderStatus.orderItems && orderStatus.orderItems.map(item => (
              <li key={item.productId}>
                {item.productName} (x{item.quantity}) - ₺{item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
