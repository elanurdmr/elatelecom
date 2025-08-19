import React, { useEffect, useState } from 'react';
import { getOrders, updateOrder, deleteOrder } from '../../utils/services/orderService';

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
    <div className="order-management">
      <h2>Order Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.userId}</td>
              <td>{order.totalPrice}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleEdit(order)}>Edit</button>
                <button onClick={() => handleDelete(order.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Order</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Status:
                <input type="text" name="status" value={formData.status} onChange={handleChange} required />
              </label>
              {/* Add other fields for editing if needed */}
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
