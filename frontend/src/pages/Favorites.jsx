import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Favorites.css';

const Favorites = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa mock data göster
    if (!user || !token) {
      fetchFavorites();
      return;
    }
    fetchFavorites();
  }, [user, token, navigate]);

  const fetchFavorites = async () => {
    try {
      // For now, we'll use a mock favorites list
      // In the future, this would fetch from the backend
      const mockFavorites = [
        {
          id: '1',
          name: 'Sample Product 1',
          price: 99.99,
          image: '/placeholder-product.jpg',
          description: 'This is a sample product description'
        },
        {
          id: '2',
          name: 'Sample Product 2',
          price: 149.99,
          image: '/placeholder-product.jpg',
          description: 'Another sample product description'
        }
      ];
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = (productId) => {
    setFavorites(favorites.filter(item => item.id !== productId));
  };

  const addToCart = (product) => {
    // This would add the product to cart via API
    console.log('Adding to cart:', product);
    // For now, just show an alert
    alert(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        <p>Your saved products and wishlist items</p>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>No favorites yet</h2>
          <p>Start adding products to your favorites to see them here!</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <div key={product.id} className="favorite-item">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <button 
                  className="remove-favorite"
                  onClick={() => removeFromFavorites(product.id)}
                  title="Remove from favorites"
                >
                  ×
                </button>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <div className="product-actions">
                  <button 
                    className="btn-add-to-cart"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn-view-details"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    View Details
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
