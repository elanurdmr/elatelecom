import React, { useEffect, useState } from 'react';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => {
        console.log(data);        // Konsola yazdır
        setProducts(data);        // State'e ata
      })
      .catch(error => console.error("Hata:", error));
  }, []);

  return (
    <div>
      <h2>Ürün Listesi</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - {product.price} TL
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
