import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import './AuthModal.css';

function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setIsLoggedIn } = useAppContext();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  if (!isAuthModalOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(`http://localhost:8080${endpoint}` ,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Hata');
      }
      setIsLoggedIn(true);
      setIsAuthModalOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div className="auth-card" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}</h3>
        <div className="auth-field">
          <label>Email</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder=" " />
        </div>
        <div className="auth-field">
          <label>Şifre</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder=" " />
        </div>
        {error && <div className="error" style={{marginTop:8}}>{error}</div>}
        <div className="auth-actions">
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Gönderiliyor...' : (mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
          <button className="btn-outline" onClick={()=> setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
