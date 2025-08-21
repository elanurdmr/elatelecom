// src/components/ProductCard.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHeart } from 'react-icons/fa'; // Import FaHeart icon

function ProductCard({ product }) {
  const { user, addToCart, toggleFavorite, favoriteIds } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    toggleFavorite(product.id);
  };

  return (
    <div className="product-card">
      {/* Ürün görseli buraya gelecek, şu anda yorum satırında */}
      {/* {product.image && <img src={product.image} alt={product.name} className="product-image" />} */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {/* <p className="product-description">{product.description}</p> */}
        {/* <span className="product-category">{product.category}</span> */}
        <p className="product-price">₺{product.price.toFixed(2)}</p>
      </div>

      <div className="product-actions">
        <button 
          className="btn-add-to-cart"
          onClick={handleAddToCart}
        >
          Sepete Ekle
        </button>
        <button 
          className={`btn-add-to-favorites ${favoriteIds.includes(product.id) ? 'active' : ''}`}
          onClick={handleToggleFavorite}
        >
          <FaHeart />
        </button>
        <button 
          className="btn-view-details"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          Detayları Gör
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
