import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/services/api';
import AuthModal from '../components/AuthModal';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const { user, setIsAuthModalOpen, favoriteIds, toggleFavorite, addToCart } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api("/products"); // Removed '/api' prefix
        const p = data.find(x => String(x.id) === String(id));
        setProduct(p);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (product) addToCart(product);
  };

  if (loading) return <div className="pd-loading">Yükleniyor...</div>;
  if (error) return <div className="pd-error">Hata: {error}</div>;
  if (!product) return <div className="pd-error">Ürün bulunamadı.</div>;

  const isFav = favoriteIds.includes(product.id);

  return (
    <div className="product-details">
      <div className="pd-card">
        {/* <div className="pd-thumb">
          {product.image && <img src={product.image} alt={product.name} />}
        </div> */}
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
