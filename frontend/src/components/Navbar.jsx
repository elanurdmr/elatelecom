import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import './Navbar.css';

function Navbar() {
  const [cartAnimate, setCartAnimate] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, setIsAuthModalOpen } = useAppContext();

  const handleCartMouseEnter = () => {
    setCartAnimate(true);
    setTimeout(() => setCartAnimate(false), 2000);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleGlobalClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleLoginClick = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">Ela Telekom</Link>
      </div>
      <div className="navbar-right">
        <Link to="/favorites" className="icon-link" title="Favoriler">
          <FaStar className="navbar-icon" />
        </Link>
        <button
          className={`icon-link cart-icon-wrapper${cartAnimate ? ' animate' : ''}`}
          title="Sepet"
          onMouseEnter={handleCartMouseEnter}
          onClick={handleCartClick}
        >
          <FaShoppingCart className="navbar-icon" />
        </button>
        <div className="profile-wrapper" ref={dropdownRef}>
          <button className="icon-link profile-button" title="Profil" onClick={toggleDropdown}>
            <FaUser className="navbar-icon" />
          </button>
          {isDropdownOpen && (
            <div className="profile-dropdown">
              {!isLoggedIn ? (
                <>
                  <button className="dropdown-item" onClick={handleLoginClick}>Giriş Yap</button>
                  <button className="dropdown-item" onClick={() => navigate('/register')}>Kayıt Ol</button>
                </>
              ) : (
                <>
                  <button className="dropdown-item" onClick={() => navigate('/profile')}>Profilim</button>
                  <button className="dropdown-item" onClick={() => navigate('/orders')}>Siparişlerim</button>
                  <button className="dropdown-item" onClick={() => navigate('/order-tracking')}>Sipariş Takibi</button>
                  <button className="dropdown-item" onClick={() => navigate('/favorites')}>Favorilerim</button>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item" onClick={handleLogoutClick}>Çıkış Yap</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
