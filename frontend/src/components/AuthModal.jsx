import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        // Register logic, assuming a register function in AuthContext or handling it here separately
        // For now, I'll assume login is sufficient for the immediate problem.
        // If there's a separate register function, it should be called here.
        // This part needs to be adjusted based on the actual backend register endpoint and AuthContext implementation.
        console.log("Register functionality not yet fully implemented via AuthContext");
        throw new Error("Kayıt ol özelliği şu an için desteklenmiyor.");
      }
      setIsAuthModalOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h3>
        <div className="auth-field">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " />
        </div>
        <div className="auth-field">
          <label>Şifre</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " />
        </div>
        {error && <div className="error" style={{ marginTop: 8 }}>{error}</div>}
        <div className="auth-actions">
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Gönderiliyor...' : (mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
          <button className="btn-outline" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
