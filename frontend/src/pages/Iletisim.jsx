import React from 'react';
import '../assets/styles/infoPages.css';

function Contact() {
  return (
    <div className="info-page-container">
      <h1>İletişim</h1>
      <p>Bize ulaşmak için aşağıdaki bilgilerden faydalanabilir veya iletişim formunu doldurabilirsiniz.</p>
      
      <h2>Adres</h2>
      <p>Örnek Mah. Örnek Cad. No: 123, Kat: 4, Daire: 5, Merkez/İstanbul</p>

      <h2>Telefon</h2>
      <p>Müşteri Hizmetleri: +90 555 123 45 67</p>

      <h2>E-posta</h2>
      <p>Genel Sorular: info@elatelekom.com</p>
      <p>Destek: destek@elatelekom.com</p>

      <h2>Çalışma Saatleri</h2>
      <p>Hafta İçi: 09:00 - 18:00</p>
      <p>Cumartesi: 09:00 - 13:00</p>
      <p>Pazar: Kapalı</p>
    </div>
  );
}

export default Contact;
