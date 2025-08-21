import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductList.css';
import { FaHeart } from 'react-icons/fa'; // Added FaHeart import

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user, token, addToCart, toggleFavorite, favoriteIds } = useAuth(); // Add addToCart, toggleFavorite, favoriteIds

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

  const handleAddToCart = (product) => {
    if (!user || !token) {
      // alert('Sepete eklemek için giriş yapmanız gerekiyor!'); // Alert removed, AuthContext handles modal
      return;
    }
    addToCart(product); // Call AuthContext's addToCart
  };

  const handleAddToFavorites = (product) => {
    if (!user || !token) {
      // alert('Favorilere eklemek için giriş yapmanız gerekiyor!'); // Alert removed, AuthContext handles modal
      return;
    }
    toggleFavorite(product.id); // Call AuthContext's toggleFavorite
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = ['all', 'cihaz', 'sim', 'paket'];

  if (loading) {
    return (
      <div className="product-list">
        <div className="loading">Ürünler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-list">
        <div className="error">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div className="product-list">
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
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {/* <img 
                src={product.image || '/placeholder-product.jpg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              /> */}
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-category">{product.category}</p>
              <p className="product-price">₺{product.price.toLocaleString()}</p>
              <div className="product-actions">
                <Link 
                  to={`/product/${product.id}`} 
                  className="btn-view-details"
                >
                  Detayları Gör
                </Link>
                <button
                  className="btn-add-to-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  Sepete Ekle
                </button>
                <button
                  className={`btn-add-to-favorites ${favoriteIds.includes(product.id) ? 'active' : ''}`}
                  onClick={() => handleAddToFavorites(product)}
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>Bu kategoride ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;

