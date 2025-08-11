import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';

function Favorites() {
  const { favoriteIds, toggleFavorite } = useAppContext();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => { if (!res.ok) throw new Error('Sunucu hatası'); return res.json(); })
      .then(data => { setAll(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const products = all.filter(p => favoriteIds.includes(p.id));

  if (loading) return <div className="favorites-loading">Yükleniyor...</div>;
  if (error) return <div className="favorites-error">Hata: {error}</div>;

  return (
    <div className="favorites-page">
      <h1>Favorilerim</h1>
      {products.length === 0 ? (
        <p>Henüz favori ürününüz yok.</p>
      ) : (
        <div className="favorites-grid">
          {products.map(p => (
            <div key={p.id} className="fav-card" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="thumb" />
              <div className="title">{p.name}</div>
              <div className="price">{p.price} TL</div>
              <div className="fav-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn-outline" onClick={() => toggleFavorite(p.id)}>Favoriden Çıkar</button>
                <button className="btn-primary" onClick={() => navigate(`/product/${p.id}`)}>Detaya Git</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
