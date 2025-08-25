import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import { FaTools } from "react-icons/fa"; // Import FaTools icon

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // useNavigate hook'unu çağırarak navigate değişkenini tanımla

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // Add this line back

  // Simulate login/logout based on user context
  useEffect(() => {
    // This effect is likely not needed anymore as user state is global via AuthContext
    // However, if there are local state needs based on `user` context, they would go here.
  }, [user]);

  const handleLogout = () => {
    logout(); // Use logout from AuthContext
    setIsProfileDropdownOpen(false); // Add this line back
  };

  const handleLoginClick = () => {
    setIsProfileDropdownOpen(false); // Add this line back
    navigate('/login');
  };

  const handleRegisterClick = () => {
    setIsProfileDropdownOpen(false); // Add this line back
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
        {user && user.role === 'ADMIN' && (
          <Link to="/admin/dashboard" className="icon-link admin-panel-icon" title="Admin Paneli">
            <FaTools className="navbar-icon" /> {/* Use FaTools icon */}
          </Link>
        )}
        <div className="icon-link profile-wrapper" onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} title="Profil">
          <FaUser className="navbar-icon" />
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              {user ? (
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
