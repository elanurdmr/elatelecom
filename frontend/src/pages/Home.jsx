import React from 'react';
import './Home.css';
import FeaturedSlider from '../components/FeaturedSlider';
import FeaturedProducts from '../components/FeaturedProducts';
import AuthModal from '../components/AuthModal';

function Home() {
  return (
    <div className="home">
      <div className="home-top">
        <FeaturedSlider />
        <FeaturedProducts />
      </div>
      <div className="hero-section">
        <h1>Ela Telekom'a Hoş Geldiniz</h1>
        <p>Telekomünikasyon çözümlerinde güvenilir ortağınız</p>
        <div className="hero-buttons">
          <button className="btn-primary">Hizmetlerimiz</button>
          <button className="btn-secondary">İletişim</button>
        </div>
      </div>
      
      <div className="features-section">
        <h2>Neden Ela Telekom?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Güvenilir Hizmet</h3>
            <p>7/24 teknik destek ve kesintisiz hizmet</p>
          </div>
          <div className="feature-card">
            <h3>Modern Teknoloji</h3>
            <p>En son teknolojiler ile donatılmış altyapı</p>
          </div>
          <div className="feature-card">
            <h3>Uygun Fiyat</h3>
            <p>Rekabetçi fiyatlarla kaliteli hizmet</p>
          </div>
        </div>
      </div>
      <AuthModal />
    </div>
  );
}

export default Home;

