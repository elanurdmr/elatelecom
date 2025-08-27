import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/services/api';
import { useNavigate } from 'react-router-dom';
import './Orders.css';
import { cancelOrder } from '../utils/services/orderService';

const Orders = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancelId, setOrderToCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const navigate = useNavigate();

  const cancellationReasons = [
    'Yanlış ürün sipariş ettim',
    'Fikrimi değiştirdim',
    'Daha hızlı teslimat buldum',
    'Ürün açıklaması yetersiz',
    'Farklı bir mağazadan sipariş vermek istiyorum',
    'Diğer'
  ];

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
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const handleCancelButtonClick = (orderId) => {
    setOrderToCancelId(orderId);
    setIsCancelModalOpen(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancelId || !cancelReason) {
      alert('Lütfen bir iptal nedeni seçin.');
      return;
    }

    const finalCancelReason = cancelReason === 'Diğer' ? otherReason : cancelReason;

    try {
      await cancelOrder(orderToCancelId, finalCancelReason);
      fetchOrders(); // Siparişleri yeniden çekerek listeyi güncelle
      setIsCancelModalOpen(false);
      setOrderToCancelId(null);
      setCancelReason('');
      setOtherReason('');
    } catch (err) {
      console.error('Sipariş iptali başarısız oldu:', err);
      let errorMessage = 'Sipariş iptal edilirken bir hata oluştu. Lütfen tekrar deneyin.';
      if (err.message) {
        errorMessage = err.message; // Doğrudan hata mesajını al
      }
      alert(errorMessage); // Kullanıcıya hatayı göster
      setError(errorMessage);
    }
  };

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

  useEffect(() => {
    if (!user || !token) {
      setLoading(false);
      setError('Siparişlerinizi görüntülemek için giriş yapmalısınız.');
      return;
    }

    fetchOrders();
  }, [user, token]);

  if (loading) {
    return <div className="orders-container">Siparişler yükleniyor...</div>;
  }

  if (error) {
    return <div className="orders-container error">Hata: {error}</div>;
  }

  return (
    <div className="orders-container">
      <h1>Siparişlerim</h1>
      {orders.length === 0 ? (
        <p>Henüz siparişiniz yok.</p>
      ) : (
        <div className="orders-list">
          <h2>Tüm Siparişler ({orders.length})</h2>
          <p>Toplam Sipariş Tutarı: {orders.reduce((acc, order) => acc + order.total, 0).toFixed(2)} TL</p>
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <h3>Sipariş No: {order.orderNumber}</h3>
              <p>Durum: {getTranslatedStatus(order.status)}</p>
              <p>Toplam: {(order.total || 0).toFixed(2)} TL</p>
              <p>Tarih: {new Date(order.orderDate).toLocaleDateString()}</p>
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
              {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'SHIPPED' && (
                <button
                  className="btn-cancel-order"
                  onClick={() => handleCancelButtonClick(order.id)}
                  disabled={order.status === 'SHIPPED'}
                >
                  Siparişi İptal Et
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {isCancelModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Sipariş İptal Nedeni Seçin</h2>
              <button onClick={() => setIsCancelModalOpen(false)} className="modal-close">×</button>
            </div>
            <div className="modal-body">
              <p>Siparişinizi neden iptal etmek istediğinizi belirtiniz:</p>
              <select 
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="cancel-reason-select"
              >
                <option value="">Lütfen bir neden seçin</option>
                {cancellationReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              {cancelReason === 'Diğer' && (
                <textarea
                  placeholder="Diğer iptal nedenini buraya yazın..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  className="other-reason-textarea"
                />
              )}
              <div className="modal-actions">
                <button onClick={confirmCancelOrder} className="btn-primary" disabled={!cancelReason || (cancelReason === 'Diğer' && !otherReason)}>
                  Siparişi İptal Et
                </button>
                <button onClick={() => setIsCancelModalOpen(false)} className="btn-view-details">
                  Geri Dön
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
