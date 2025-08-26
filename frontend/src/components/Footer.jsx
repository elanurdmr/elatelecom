import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // We will create this CSS file next

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-links">
        <Link to="/about" className="footer-link">Hakkımızda</Link>
        <Link to="/contact" className="footer-link">İletişim</Link>
        <Link to="/privacy" className="footer-link">Gizlilik Politikası</Link>
        <Link to="/terms" className="footer-link">Kullanım Koşulları</Link>
        <Link to="/faq" className="footer-link">Sıkça Sorulan Sorular</Link>
      </div>
      <div className="footer-copy">
        <p>© {new Date().getFullYear()} Elatelekom. Tüm Hakları Saklıdır.</p>
      </div>
    </footer>
  );
}

export default Footer;
