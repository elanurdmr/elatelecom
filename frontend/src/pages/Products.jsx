import React from 'react';
import ProductList from '../components/ProductList';
import './Products.css';

function Products() {
  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Ürünlerimiz</h1>
        <p>Kaliteli telekomünikasyon çözümlerimizi keşfedin</p>
      </div>
      <div className="products-container">
        <ProductList />
      </div>
    </div>
  );
}

export default Products;
