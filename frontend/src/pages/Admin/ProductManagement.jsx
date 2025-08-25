import React, { useEffect, useState } from 'react';
import { getProducts, deleteProduct, createProduct, updateProduct } from '../../utils/services/productService';
import './UserManagement.css'; // Import shared CSS

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts(); // Refresh the list after deletion
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleAddEdit = (product = null) => {
    setCurrentProduct(product);
    if (product) {
      setFormData({ ...product, price: product.price.toString() });
    } else {
      setFormData({ name: '', description: '', price: '', category: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await updateProduct(currentProduct.id, { ...formData, price: parseFloat(formData.price) });
      } else {
        await createProduct({ ...formData, price: parseFloat(formData.price) });
      }
      fetchProducts(); // Refresh the list
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-management">
      <h2>Ürün Yönetimi</h2>
      <button onClick={() => handleAddEdit()} className="add-user-button">Yeni Ürün Ekle</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Kategori</th>
            <th>Fiyat</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₺{product.price.toFixed(2)}</td>
              <td>
                <button onClick={() => handleAddEdit(product)} className="edit-button">Düzenle</button>
                <button onClick={() => handleDelete(product.id)} className="delete-button">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
            <form onSubmit={handleSubmit}>
              <label>
                Ad:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label>
                Açıklama:
                <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
              </label>
              <label>
                Fiyat:
                <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" />
              </label>
              <label>
                Kategori:
                <input type="text" name="category" value={formData.category} onChange={handleChange} required />
              </label>
              <label>
                Resim URL:
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
              </label>
              <button type="submit">Kaydet</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>İptal</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
