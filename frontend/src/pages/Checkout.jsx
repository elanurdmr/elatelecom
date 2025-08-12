import { useState } from "react";

export default function Checkout() {
  const [form, setForm] = useState({
    address: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify(form)
    }).then(() => alert("Siparişiniz oluşturuldu!"));
  };

  return (
    <div>
      <h2>Siparişi Onayla</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Adres"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <input
          placeholder="Kart Numarası"
          value={form.cardNumber}
          onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
        />
        <input
          placeholder="Son Kullanma Tarihi (MM/YY)"
          value={form.expiry}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })}
        />
        <input
          placeholder="CVV"
          value={form.cvv}
          onChange={(e) => setForm({ ...form, cvv: e.target.value })}
        />
        <button type="submit">Siparişi Tamamla</button>
      </form>
    </div>
  );
}
