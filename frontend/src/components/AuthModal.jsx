import React from 'react';
import { useAppContext } from '../context/AppContext';
import './AuthModal.css';

function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setIsLoggedIn } = useAppContext();
  if (!isAuthModalOpen) return null;

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="auth-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <h3>Devam etmek için giriş yapın</h3>
        <p>Hesabınıza giriş yapın veya hızlıca kayıt olun.</p>
        <div className="auth-actions">
          <button className="btn-primary" onClick={handleLogin}>Giriş Yap</button>
          <button className="btn-outline">Kayıt Ol</button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
