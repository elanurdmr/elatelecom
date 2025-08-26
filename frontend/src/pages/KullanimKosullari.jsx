import React from 'react';
import '../assets/styles/infoPages.css';

function TermsOfService() {
  return (
    <div className="info-page-container">
      <h1>Kullanım Koşulları</h1>
      <p>Elatelekom hizmetlerini kullanmadan önce lütfen aşağıdaki kullanım koşullarını dikkatlice okuyunuz. Hizmetlerimizi kullanarak bu koşulları kabul etmiş sayılırsınız.</p>

      <h2>1. Hizmetlerin Tanımı</h2>
      <p>Elatelekom, telekomünikasyon ve internet hizmetleri sunmaktadır. Bu hizmetler, mevcut teknolojik altyapı ve yasal düzenlemeler çerçevesinde sağlanır.</p>

      <h2>2. Kullanıcı Sorumlulukları</h2>
      <ul>
        <li>Hizmetleri yasalara ve genel ahlak kurallarına uygun kullanmak.</li>
        <li>Hesap bilgilerinizin güvenliğini sağlamak.</li>
        <li>Başka kullanıcıların haklarını ihlal etmemek.</li>
      </ul>

      <h2>3. Fiyatlandırma ve Ödeme</h2>
      <p>Hizmetlerimizin fiyatları web sitemizde belirtilmiştir. Ödemeler, seçtiğiniz ödeme yöntemine göre zamanında yapılmalıdır. Ödeme gecikmelerinde hizmet kesintileri yaşanabilir.</p>

      <h2>4. Hizmet Değişiklikleri ve İptali</h2>
      <p>Elatelekom, hizmetlerinde önceden bildirimde bulunarak değişiklik yapma veya hizmeti durdurma hakkını saklı tutar. Kullanıcılar, istedikleri zaman hizmetlerini iptal edebilirler.</p>

      <h2>5. Fikri Mülkiyet Hakları</h2>
      <p>Web sitemizdeki tüm içerik (metin, görsel, logo vb.) Elatelekom'a aittir ve fikri mülkiyet kanunları ile korunmaktadır. İzinsiz kopyalama ve kullanım yasaktır.</p>

      <h2>6. Sorumluluğun Sınırlandırılması</h2>
      <p>Elatelekom, hizmetlerin kesintisiz veya hatasız olacağını garanti etmez. Hizmet kullanımından doğabilecek dolaylı veya doğrudan zararlardan sorumlu tutulamaz.</p>

      <h2>7. Anlaşmazlıkların Çözümü</h2>
      <p>Bu kullanım koşullarından doğacak anlaşmazlıklar, Türkiye Cumhuriyeti yasalarına göre İstanbul Mahkemeleri'nde çözülecektir.</p>
    </div>
  );
}

export default TermsOfService;
