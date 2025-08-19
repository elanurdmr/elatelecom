import api from './api';

export const getUsers = async () => {
  return api('/admin/users');
};

export const getUserById = async (id) => {
  return api(`/admin/users/${id}`);
};

export const createUser = async (userData) => {
  return api('/admin/users', 'POST', userData);
};

export const updateUser = async (id, userData) => {
  return api(`/admin/users/${id}`, 'PUT', userData);
};

export const deleteUser = async (id) => {
  return api(`/admin/users/${id}`, 'DELETE');
};
