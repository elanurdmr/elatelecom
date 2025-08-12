import React, { useEffect, useState } from 'react';
import './ProductList.css';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);     
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => {
        console.log("Response:", res);
        if (!res.ok) {
          throw new Error("Sunucu hatası");
        }
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Hata:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">Hata: {error}</div>;

  return (
    <div className="product-list">
      {products.length === 0 ? (
        <div className="no-products">
          <p>Henüz ürün bulunmamaktadır.</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
              <h3>{product.name}</h3>
              <p className="product-price">{product.price} TL</p>
              <button className="product-button" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}>Detaylar</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;

