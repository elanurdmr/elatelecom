import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AuthModal from '../components/AuthModal';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const { isLoggedIn, setIsAuthModalOpen, favoriteIds, toggleFavorite, addToCart } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => { if (!res.ok) throw new Error('Sunucu hatası'); return res.json(); })
      .then(data => { const p = data.find(x => String(x.id) === String(id)); setProduct(p); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleAddToCart = () => {
    if (!isLoggedIn) { setIsAuthModalOpen(true); return; }
    if (product) addToCart(product);
  };

  if (loading) return <div className="pd-loading">Yükleniyor...</div>;
  if (error) return <div className="pd-error">Hata: {error}</div>;
  if (!product) return <div className="pd-error">Ürün bulunamadı.</div>;

  const isFav = favoriteIds.includes(product.id);

  return (
    <div className="product-details">
      <div className="pd-card">
        <div className="pd-thumb" />
        <div className="pd-info">
          <h1>{product.name}</h1>
          <div className="pd-price">{product.price} TL</div>
          <p className="pd-desc">Yüksek performanslı, güvenilir ve şık tasarım. İhtiyaçlarınıza uygun kalite.</p>
          <div className="pd-actions">
            <button className="btn-primary" onClick={handleAddToCart}>Sepete Ekle</button>
            <button className="btn-outline" onClick={() => toggleFavorite(product.id)}>{isFav ? 'Favorilerden Çıkar' : 'Favorile'}</button>
          </div>
        </div>
      </div>
      <AuthModal />
    </div>
  );
}

export default ProductDetails;
