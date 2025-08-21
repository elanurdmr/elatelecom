import api from './api';

export const getProducts = async () => {
  return api('/products');
};

export const getProductById = async (id) => {
  return api(`/products/${id}`);
};

export const createProduct = async (productData) => {
  return api('/admin/products', 'POST', productData);
};

export const updateProduct = async (id, productData) => {
  return api(`/admin/products/${id}`, 'PUT', productData);
};

export const deleteProduct = async (id) => {
  return api(`/admin/products/${id}`, 'DELETE');
};
