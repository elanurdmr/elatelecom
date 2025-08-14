import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import './Navbar.css';

function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useAppContext();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileDropdownOpen(false);
  };

  const handleLoginClick = () => {
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleRegisterClick = () => {
    setIsProfileDropdownOpen(false);
    navigate('/register');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <h2>Ela Telekom</h2>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/favorites" className="icon-link star-icon" title="Favoriler">
          <FaStar className="navbar-icon" />
        </Link>
        <Link
          to="/cart"
          className="icon-link cart-icon-wrapper"
          title="Sepet"
        >
          <FaShoppingCart className="navbar-icon" />
        </Link>
        <div className="icon-link profile-wrapper" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} title="Profil">
          <FaUser className="navbar-icon" />
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>Profilim</Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>Siparişlerim</Link>
                  <Link to="/order-tracking" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>Sipariş Takibi</Link>
                  <Link to="/favorites" className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>Favorilerim</Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>Çıkış Yap</button>
                </>
              ) : (
                <>
                  <button className="dropdown-item" onClick={handleLoginClick}>Giriş Yap</button>
                  <button className="dropdown-item" onClick={handleRegisterClick}>Kayıt Ol</button>
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
