import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProductById } from '../utils/services/productService';
import './Favorites.css';

const Favorites = () => {
  const { user, token, favoriteIds, addToCart, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!user || !token || favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const fetchedProducts = await Promise.all(
          favoriteIds.map(id => getProductById(id))
        );
        setFavorites(fetchedProducts);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteProducts();
  }, [user, token, favoriteIds]);

  const removeFromFavorites = (productId) => {
    toggleFavorite(productId);
  };

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading">Favoriler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>Favori Ürünlerim</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>Henüz favorilenmiş ürün yok</h2>
          <p>Favorilerinize ürün eklemeye başlayın!</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Ürünlere Göz At
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <div key={product.id} className="favorite-item">
              <div className="product-image">
                {/* <img src={product.image} alt={product.name} */}
                <button 
                  className="remove-favorite"
                  onClick={() => removeFromFavorites(product.id)}
                  title="Favorilerden Kaldır"
                >
                  ×
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price.toFixed(2)} TL</p>
                <div className="product-actions">
                  <button 
                    className="btn-add-to-cart"
                    onClick={() => addToCart(product)}
                  >
                    Sepete Ekle
                  </button>
                  <button 
                    className="btn-view-details"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    Detayları Görüntüle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
