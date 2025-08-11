import React from 'react';
import './ProductModal.css';

function ProductModal({ product, onClose, onAddToCart, onToggleFavorite, isFavorite }) {
  if (!product) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-header">
          <div className="modal-thumb" />
          <div>
            <h3>{product.name}</h3>
            <div className="price">{product.price} TL</div>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onAddToCart}>Sepete Ekle</button>
          <button className="btn-outline" onClick={onToggleFavorite}>{isFavorite ? 'Favorilerden Çıkar' : 'Favorile'}</button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
