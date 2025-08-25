import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder, deleteOrder } from '../../utils/services/orderService';
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
    if (window.confirm('Are you sure you want to delete this order?')) {
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
      await updateOrder(currentOrder.id, formData);
      fetchOrders(); // Refresh the list
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

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
              <td>{order.status}</td>
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
                <input type="text" name="status" value={formData.status} onChange={handleChange} required />
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
