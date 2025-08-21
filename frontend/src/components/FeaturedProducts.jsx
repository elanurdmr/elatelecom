import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './FeaturedProducts.css';
import ProductCard from '../components/ProductCard'; // Import ProductCard

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user, token } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error('Ürünler yüklenemedi');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = ['all', 'cihaz', 'sim', 'paket'];

  if (loading) {
    return (
      <div className="featured-products">
        <div className="loading">Ürünler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-products">
        <div className="error">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div className="featured-products">
      <h2>Öne Çıkan Ürünler</h2>
      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' ? 'Tümü' : 
             category === 'cihaz' ? 'Cihazlar' :
             category === 'sim' ? 'SIM Kartlar' : 'Tarife Paketleri'}
          </button>
        ))}
      </div>
      <div className="products-grid">
        {filteredProducts.slice(0, 6).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="view-all-container">
        <Link to="/products" className="btn-view-all">
          Tüm Ürünleri Gör
        </Link>
      </div>
    </div>
  );
};

export default FeaturedProducts;
