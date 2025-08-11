import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import ProductModal from './ProductModal';
import { useNavigate } from 'react-router-dom';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const { isLoggedIn, setIsAuthModalOpen, favoriteIds, toggleFavorite, addToCart } = useAppContext();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => { if (!res.ok) throw new Error('Sunucu hatası'); return res.json(); })
      .then(data => { setProducts(data.slice(0, 8)); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) { setIsAuthModalOpen(true); return; }
    addToCart(product);
  };

  if (loading) return <div className="featured-loading">Öne çıkan ürünler yükleniyor...</div>;
  if (error) return <div className="featured-error">Hata: {error}</div>;

  return (
    <div className="featured-products">
      <h2>Öne Çıkan Ürünler</h2>
      <div className="scroller">
        {products.map(p => (
          <div className="fp-card" key={p.id} onClick={() => navigate(`/product/${p.id}`)}>
            <div className="fp-thumb" />
            <div className="fp-body">
              <div className="fp-title">{p.name}</div>
              <div className="fp-price">{p.price} TL</div>
            </div>
            <div className="fp-actions" onClick={(e) => e.stopPropagation()}>
              <button className="btn-outline" onClick={() => setSelected(p)}>Detay</button>
              <button className="btn-primary" onClick={() => handleAddToCart(p)}>Sepete Ekle</button>
              <button
                className="favorite-btn"
                aria-label="favori"
                onClick={() => toggleFavorite(p.id)}
              >
                {favoriteIds.includes(p.id) ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
          </div>
        ))}
      </div>
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAddToCart={() => handleAddToCart(selected)}
          onToggleFavorite={() => toggleFavorite(selected.id)}
          isFavorite={favoriteIds.includes(selected.id)}
        />
      )}
    </div>
  );
}

export default FeaturedProducts;
