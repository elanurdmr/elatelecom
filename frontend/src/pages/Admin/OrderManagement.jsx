import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder, deleteOrder, updateOrderStatus } from '../../utils/services/orderService';
import './UserManagement.css'; // Import shared CSS

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    // Add other relevant order fields here if needed
  });

  const getTranslatedStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Hazırlanıyor';
      case 'CONFIRMED':
        return 'Onaylandı';
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Bu siparişi silmek istediğinize emin misiniz?')) {
      try {
        await deleteOrder(orderId);
        fetchOrders(); // Refresh the list after deletion
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (order) => {
    setCurrentOrder(order);
    setFormData({ status: order.status }); // Initialize form with current order status
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrderStatus(currentOrder.id, formData.status);
      fetchOrders(); // Refresh the list
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Siparişler yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="user-management">
      <h2>Sipariş Yönetimi</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı ID</th>
            <th>Toplam Fiyat</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>₺{(order.total || 0).toFixed(2)}</td>
              <td>{getTranslatedStatus(order.status)}</td>
              <td>
                <button onClick={() => handleEdit(order)} className="edit-button">Düzenle</button>
                <button onClick={() => handleDelete(order.id)} className="delete-button">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Siparişi Düzenle</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Durum:
                <select name="status" value={formData.status} onChange={handleChange} required>
                  {[ 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED' ].map(statusOption => (
                    <option key={statusOption} value={statusOption}>
                      {getTranslatedStatus(statusOption)}
                    </option>
                  ))}
                </select>
              </label>
              {/* Add other fields for editing if needed */}
              <button type="submit">Kaydet</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>İptal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
