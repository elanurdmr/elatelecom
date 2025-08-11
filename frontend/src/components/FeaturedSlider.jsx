import React, { useEffect, useState } from 'react';
import './FeaturedSlider.css';

const slides = [
  { id: 1, title: 'Fiber Hızında İnternet', text: 'Kesintisiz bağlantı ve yüksek hız', cta: 'Hemen Başla', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop' },
  { id: 2, title: 'Kurumsal Cihazlar', text: 'İşletmeniz için güvenilir gereçler', cta: 'Teklif Al', image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1600&auto=format&fit=crop' },
  { id: 3, title: 'Uygun Fiyatlar', text: 'Her bütçeye uygun paketler', cta: 'Paketleri Gör', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop' },
];

function FeaturedSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((prev) => (prev + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="featured-slider">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`slide ${i === index ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(135deg, rgba(43,44,127,0.6), rgba(75,46,131,0.6)), url(${s.image})` }}
        >
          <div className="slide-content">
            <h2>{s.title}</h2>
            <p>{s.text}</p>
            <button className="slide-cta">{s.cta}</button>
          </div>
        </div>
      ))}
      <div className="dots">
        {slides.map((s, i) => (
          <button key={s.id} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)} aria-label={`slide ${i+1}`} />
        ))}
      </div>
    </div>
  );
}

export default FeaturedSlider;
