import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/services/api';
import { FaTruck, FaBox, FaShippingFast, FaCheckCircle } from 'react-icons/fa';
import './OrderTracking.css';

function OrderTracking() {
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [singleOrderView, setSingleOrderView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrderStatus = async (currentOrderId) => {
    setLoading(true);
    setError(null);
    try {
      if (currentOrderId) {
        const response = await api(`/orders/number/${currentOrderId}`, 'GET');
        setOrderStatus(response);
        setSingleOrderView(true);
      } else {
        const response = await api('/orders/user', 'GET');
        setAllOrders(response ?? []);
        setSingleOrderView(false);
      }
    } catch (err) {
      console.error('Error fetching order status:', err);
      setError('Sipariş durumu yüklenirken bir hata oluştu. Lütfen sipariş numarasını kontrol edin.');
      setOrderStatus(null);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered with paramOrderId:', paramOrderId);
    fetchOrderStatus(paramOrderId);
  }, [paramOrderId]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <FaBox className="icon" />;
      case 'PROCESSING':
        return <FaTruck className="icon" />;
      case 'SHIPPED':
        return <FaShippingFast className="icon" />;
      case 'DELIVERED':
        return <FaCheckCircle className="icon delivered" />;
      default:
        return null; // Return null for unknown statuses
    }
  };

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

  return (
    <div className="order-tracking-container">
      <h2>Sipariş Takibi</h2>
      {loading && <p>Yükleniyor...</p>}
      {error && <p className="error-message">{error}</p>}

      {singleOrderView && orderStatus && (
        <div className="order-details-card">
          <h3>Sipariş #{orderStatus.orderNumber}</h3>
          <p>Durum: {getTranslatedStatus(orderStatus.status)} {getStatusIcon(orderStatus.status)}</p>
          <p>Tarih: {new Date(orderStatus.orderDate).toLocaleDateString()}</p>
          <p>Toplam Tutar: {(orderStatus.total || 0).toFixed(2)} TL</p>
          <h4>Ürünler:</h4>
          <ul>
            {(orderStatus.orderItems ?? []).map((item) => (
              <li key={item.productId}>
                {item.productName} (x{item.quantity}) - {item.price} TL
              </li>
            ))}
          </ul>
          <h4>Teslimat Adresi:</h4>
          <p>{orderStatus.shippingAddress}, {orderStatus.shippingCity}, {orderStatus.shippingPostalCode}, {orderStatus.shippingCountry}</p>
          
          {console.log('Current Order Status:', orderStatus.status)}
          <div className="tracking-timeline">
            <div className={`timeline-step ${getStatusStep(orderStatus.status || 'PENDING') >= 1 ? 'active' : ''}`}>
              <FaBox className="icon" />
              <span>{getTranslatedStatus('PENDING')}</span>
            </div>
            <div className={`timeline-step ${getStatusStep(orderStatus.status || 'PENDING') >= 2 ? 'active' : ''}`}>
              <FaTruck className="icon" />
              <span>{getTranslatedStatus('PROCESSING')}</span>
            </div>
            <div className={`timeline-step ${getStatusStep(orderStatus.status || 'PENDING') >= 3 ? 'active' : ''}`}>
              <FaShippingFast className="icon" />
              <span>{getTranslatedStatus('SHIPPED')}</span>
            </div>
            <div className={`timeline-step ${getStatusStep(orderStatus.status || 'PENDING') >= 4 ? 'active' : ''}`}>
              <FaCheckCircle className="icon" />
              <span>{getTranslatedStatus('DELIVERED')}</span>
            </div>
            <div className="timeline-line"></div>
          </div>

          {((orderStatus.status || 'PENDING') === 'PROCESSING' || (orderStatus.status || 'PENDING') === 'SHIPPED') && (
            <div className="delivery-truck-animation">
              <FaTruck className="delivery-truck" />
            </div>
          )}

          <button onClick={() => navigate('/order-tracking')} className="btn-back-to-all-orders">Tüm Siparişlere Geri Dön</button>
        </div>
      )}

      {!singleOrderView && allOrders.length > 0 && (
        <div className="all-orders-list">
          <h3>Tüm Siparişleriniz ({allOrders.length})</h3>
          <p className="total-orders-amount">Toplam Sipariş Tutarı: {allOrders.reduce((acc, order) => acc + order.total, 0).toFixed(2)} TL</p>
          {allOrders.map((order) => (
            <div key={order.orderNumber} className="order-card">
              <h4>Sipariş #{order.orderNumber}</h4>
              <p>Durum: {getTranslatedStatus(order.status)} {getStatusIcon(order.status)}</p>
              <p>Toplam Tutar: {(order.total || 0).toFixed(2)} TL</p>
              <p>Tarih: {new Date(order.orderDate).toLocaleDateString()}</p>
              <button onClick={() => navigate(`/order-tracking/${order.orderNumber}`)} className="btn-track-order">Sipariş Detayı</button>
            </div>
          ))}
        </div>
      )}

      {!singleOrderView && !loading && !error && allOrders.length === 0 && (
        <p>Henüz bir siparişiniz bulunmamaktadır.</p>
      )}
    </div>
  );
}

export default OrderTracking;
