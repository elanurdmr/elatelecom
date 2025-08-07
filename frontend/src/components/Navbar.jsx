// Navbar.jsx dosyasında
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaUser } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [cartAnimate, setCartAnimate] = useState(false);

  const handleCartMouseEnter = () => {
    setCartAnimate(true);
    setTimeout(() => setCartAnimate(false), 2000);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/favorites" className="icon-link" title="Favoriler">
          <FaStar className="navbar-icon" />
        </Link>
        <div
          className={`icon-link cart-icon-wrapper${cartAnimate ? ' animate' : ''}`}
          title="Sepet"
          onMouseEnter={handleCartMouseEnter}
        >
          <FaShoppingCart className="navbar-icon" />
        </div>
        <Link to="/profile" className="icon-link" title="Profil">
          <FaUser className="navbar-icon" />
        </Link>
      </div>
      <div className="navbar-brand">
        <h2>Ela Telekom</h2>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Ana Sayfa</Link>
        <Link to="/products" className="nav-link">Ürünler</Link>
      </div>
    </nav>
  );
}

export default Navbar;
