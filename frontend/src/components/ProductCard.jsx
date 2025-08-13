// src/components/ProductCard.jsx
import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function ProductCard({ product }) {
  const { isLoggedIn, addToCart, toggleFavorite, favoriteIds } = useAppContext();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    addToCart(product);
  };

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    toggleFavorite(product.id);
  };

  return (
    <div className="product-card">
      <h4>{product.name}</h4>
      <p>{product.price}₺</p>
      <button onClick={handleAddToCart}>Sepete Ekle</button>
      <button onClick={handleToggleFavorite}>
        {favoriteIds.includes(product.id) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
      </button>
    </div>
  );
}

export default ProductCard;
