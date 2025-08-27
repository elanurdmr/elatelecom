import React from 'react';
import '../assets/styles/infoPages.css';

function FAQ() {
  return (
    <div className="info-page-container">
      <h1>Sıkça Sorulan Sorular</h1>
      <p>Aşağıda Elatelekom hizmetleri hakkında sıkça sorulan soruları ve yanıtlarını bulabilirsiniz. Daha fazla bilgi için lütfen bizimle iletişime geçin.</p>

      <h2>Sipariş ve Teslimat</h2>
      <h3>S: Siparişimi nasıl takip edebilirim?</h3>
      <p>C: Siparişinizi ana sayfamızdaki 'Sipariş Takibi' bölümünden veya 'Hesabım' sayfanızdaki siparişleriniz listesinden takip edebilirsiniz. Sipariş numaranızı girmeniz yeterlidir.</p>

      <h3>S: Kargo süresi ne kadar?</h3>
      <p>C: Siparişleriniz genellikle 1-3 iş günü içinde kargoya verilir ve teslimat adresinize bağlı olarak 2-5 iş günü içinde ulaşır.</p>

      <h2>Ödeme</h2>
      <h3>S: Hangi ödeme yöntemlerini kabul ediyorsunuz?</h3>
      <p>C: Kredi kartı (Visa, MasterCard), banka havalesi ve belirli bankaların sanal kartları ile ödeme yapabilirsiniz.</p>

      <h2>İade ve İptal</h2>
      <h3>S: Siparişimi iptal edebilir miyim?</h3>
      <p>C: Siparişiniz kargoya verilmeden önce iptal talebinde bulunabilirsiniz. İptal için müşteri hizmetlerimizle iletişime geçiniz.</p>

      <h3>S: Ürün iadesi nasıl yaparım?</h3>
      <p>C: Memnun kalmadığınız ürünleri, teslimat tarihinden itibaren 14 gün içinde, kullanılmamış ve orijinal ambalajında olmak koşuluyla iade edebilirsiniz. Detaylı bilgi için İade Politikamızı inceleyiniz.</p>

      <h2>Teknik Destek</h2>
      <h3>S: Teknik sorunlar için nasıl destek alabilirim?</h3>
      <p>C: Teknik destek talepleriniz için 'İletişim' sayfamızdaki formu doldurabilir veya destek@elatelekom.com adresine e-posta gönderebilirsiniz. Uzman ekibimiz en kısa sürede size yardımcı olacaktır.</p>
    </div>
  );
}

export default FAQ;

