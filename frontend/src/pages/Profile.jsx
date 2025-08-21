import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/services/api';
import './Profile.css';

function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      // Load existing user data
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await api(`/users/${user.id}/profile`, 'PUT', profileData);
      if (response) {
        setMessage('Profil başarıyla güncellendi!');
        // Optionally, update user in AuthContext if needed
        // setUser(response); 
      }
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      setError('Profil güncellenirken bir hata oluştu.');
    } finally {
      setIsEditing(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordChangeData.newPassword !== passwordChangeData.confirmNewPassword) {
      setPasswordError('Yeni şifreler eşleşmiyor.');
      return;
    }

    try {
      await api(`/users/${user.id}/change-password`, 'PUT', {
        oldPassword: passwordChangeData.currentPassword,
        newPassword: passwordChangeData.newPassword,
      });
      setPasswordMessage('Şifre başarıyla değiştirildi!');
      setPasswordChangeData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      setPasswordError(err.message || 'Şifre değiştirilirken bir hata oluştu.');
    }
  };

  const handlePasswordChangeDataChange = (e) => {
    const { name, value } = e.target;
    setPasswordChangeData({ ...passwordChangeData, [name]: value });
  };

  if (!user) {
    return <div className="profile-container">Lütfen giriş yapın.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profilim</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Ad:</label>
          <input 
            type="text" 
            name="firstName" 
            value={profileData.firstName} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div className="form-group">
          <label>Soyad:</label>
          <input 
            type="text" 
            name="lastName" 
            value={profileData.lastName} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={profileData.email} 
            disabled 
          />
        </div>
        <div className="form-group">
          <label>Telefon:</label>
          <input 
            type="text" 
            name="phone" 
            value={profileData.phone} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div className="form-group">
          <label>Adres:</label>
          <input 
            type="text" 
            name="address" 
            value={profileData.address} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div className="form-group">
          <label>Şehir:</label>
          <input 
            type="text" 
            name="city" 
            value={profileData.city} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div className="form-group">
          <label>Posta Kodu:</label>
          <input 
            type="text" 
            name="postalCode" 
            value={profileData.postalCode} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>
        <div className="form-group">
          <label>Ülke:</label>
          <input 
            type="text" 
            name="country" 
            value={profileData.country} 
            onChange={handleChange} 
            disabled={!isEditing} 
          />
        </div>

        {isEditing ? (
          <div className="profile-actions">
            <button type="submit" className="btn-primary">Kaydet</button>
            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>İptal</button>
          </div>
        ) : (
          <div className="profile-actions">
            <button type="button" className="btn-primary" onClick={() => setIsEditing(true)}>Profili Düzenle</button>
          </div>
        )}
      </form>

      <div className="password-change-section">
        <h3>Şifreyi Değiştir</h3>
        {passwordMessage && <p className="success-message">{passwordMessage}</p>}
        {passwordError && <p className="error-message">{passwordError}</p>}
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Mevcut Şifre:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordChangeData.currentPassword}
              onChange={handlePasswordChangeDataChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Yeni Şifre:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordChangeData.newPassword}
              onChange={handlePasswordChangeDataChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Yeni Şifreyi Onayla:</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordChangeData.confirmNewPassword}
              onChange={handlePasswordChangeDataChange}
              required
            />
          </div>
          {/* Password change fields here */}
          <button type="submit" className="btn-secondary">Şifreyi Değiştir</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
