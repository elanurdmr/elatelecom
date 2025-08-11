import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import ProductModal from './ProductModal';
import AuthModal from './AuthModal';
import { useNavigate } from 'react-router-dom';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const { isLoggedIn, setIsAuthModalOpen, favoriteIds, toggleFavorite, addToCart } = useAppContext();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('cihaz');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => { if (!res.ok) throw new Error('Sunucu hatası'); return res.json(); })
      .then(data => { setProducts(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleAddToCart = (product) => {
    if (!isLoggedIn) { setIsAuthModalOpen(true); return; }
    addToCart(product);
  };

  const getCategoryToken = (p) => ((p.category || p.type || '').toString().toLowerCase());
  const isSim = (p) => {
    const token = getCategoryToken(p);
    const name = (p.name || '').toLowerCase();
    return token === 'sim' || name.includes('sim');
  };
  const isPaket = (p) => {
    const token = getCategoryToken(p);
    const name = (p.name || '').toLowerCase();
    return token === 'paket' || name.includes('paket') || name.includes('tarife');
  };
  const isCihaz = (p) => {
    const token = getCategoryToken(p);
    if (token === 'cihaz') return true;
    return !isSim(p) && !isPaket(p);
  };

  const filtered = products.filter(p => tab === 'cihaz' ? isCihaz(p) : tab === 'sim' ? isSim(p) : isPaket(p));

  if (loading) return <div className="featured-loading">Ürünler yükleniyor...</div>;
  if (error) return <div className="featured-error">Hata: {error}</div>;

  return (
    <div className="featured-products">
      <div className="section-header">
        <h2>Ürünler</h2>
        <div className="tabs">
          <button className={`tab ${tab === 'cihaz' ? 'active' : ''}`} onClick={() => setTab('cihaz')}>Cihaz</button>
          <button className={`tab ${tab === 'sim' ? 'active' : ''}`} onClick={() => setTab('sim')}>SIM</button>
          <button className={`tab ${tab === 'paket' ? 'active' : ''}`} onClick={() => setTab('paket')}>Paket</button>
        </div>
      </div>

      <div className="scroller">
        {filtered.map(p => (
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
      <AuthModal />
    </div>
  );
}

export default FeaturedProducts;
