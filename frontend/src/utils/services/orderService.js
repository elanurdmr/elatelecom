import api from './api';

export const getOrders = async () => {
  return api('/admin/orders');
};

export const getOrderById = async (id) => {
  return api(`/admin/orders/${id}`);
};

export const updateOrder = async (id, orderData) => {
  return api(`/admin/orders/${id}`, 'PUT', orderData);
};

export const deleteOrder = async (id) => {
  return api(`/admin/orders/${id}`, 'DELETE');
};
