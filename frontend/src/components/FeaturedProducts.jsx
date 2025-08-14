import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const handleAddToCart = (product) => {
    if (!user || !token) {
      alert('Sepete eklemek için giriş yapmanız gerekiyor!');
      return;
    }
    // Sepete ekleme işlemi burada yapılacak
    console.log('Adding to cart:', product);
    alert(`${product.name} sepete eklendi!`);
  };

  const handleAddToFavorites = (product) => {
    if (!user || !token) {
      alert('Favorilere eklemek için giriş yapmanız gerekiyor!');
      return;
    }
    // Favorilere ekleme işlemi burada yapılacak
    console.log('Adding to favorites:', product);
    alert(`${product.name} favorilere eklendi!`);
  };

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
      <div className="products-grid">
        {products.slice(0, 6).map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img 
                src={product.image || '/placeholder-product.jpg'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-category">{product.category}</p>
              <p className="product-price">₺{product.price.toLocaleString()}</p>
              <div className="product-actions">
                <button
                  className="btn-add-to-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  Sepete Ekle
                </button>
                <button
                  className="btn-add-to-favorites"
                  onClick={() => handleAddToFavorites(product)}
                >
                  ❤️
                </button>
              </div>
            </div>
          </div>
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
