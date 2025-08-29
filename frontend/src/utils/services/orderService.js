import api from './api';

export const getOrders = async () => {
  return api('admin/orders');
};

export const getOrderById = async (id) => {
  return api(`admin/orders/${id}`);
};

export const updateOrder = async (id, orderData) => {
  return api(`admin/orders/${id}`, 'PUT', orderData);
};

export const deleteOrder = async (id) => {
  return api(`admin/orders/${id}`, 'DELETE');
};

export const cancelOrder = async (id, cancelReason) => {
  return api(`orders/${id}/cancel`, 'PUT', { cancelReason });
};

export const updateOrderStatus = async (id, status) => {
  return api(`admin/orders/${id}/status`, 'PUT', { status });
};