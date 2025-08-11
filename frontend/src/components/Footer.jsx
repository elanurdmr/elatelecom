import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-col">
          <h4>Hakkımızda</h4>
          <p>Ela Telekom, modern telekom çözümleri sunar. Güvenilir altyapı, uygun fiyat ve kaliteli hizmet.</p>
        </div>
        <div className="footer-col">
          <h4>S.S.S</h4>
          <ul>
            <li><a href="#">Kargo süresi nedir?</a></li>
            <li><a href="#">İade şartları nelerdir?</a></li>
            <li><a href="#">Garanti kapsamı?</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Yardım</h4>
          <ul>
            <li><a href="#">Sipariş Takibi</a></li>
            <li><a href="#">Ödeme Seçenekleri</a></li>
            <li><a href="#">Destek Merkezi</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Bize Ulaşın</h4>
          <ul>
            <li><a href="#">İletişim Formu</a></li>
            <li><a href="#">info@elatelekom.com</a></li>
            <li><a href="#">+90 555 555 55 55</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Ela Telekom. Tüm hakları saklıdır.</div>
    </footer>
  );
}

export default Footer;
