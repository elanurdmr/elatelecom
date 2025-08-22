// src/AdminDashboardHome.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AdminDashboardHome.css'; // Yeni CSS dosyasını import et

const AdminDashboardHome = () => {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]); // En çok satanlar için yeni state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Count and Recent Users
        const usersResponse = await api("/admin/users");
        setUserCount(usersResponse.length);
        setRecentUsers(usersResponse.slice(0, 5)); // En son 5 kullanıcıyı al

        // Fetch Product Count
        const productsResponse = await api("/products");
        setProductCount(productsResponse.length);

        // Fetch Order Count, Recent Orders and calculate Top Selling Products
        const ordersResponse = await api("/admin/orders");
        setOrderCount(ordersResponse.length);
        setRecentOrders(ordersResponse.slice(0, 5)); // En son 5 siparişi al

        // En çok satan ürünleri hesapla (Basit bir örnek)
        const productSales = {};
        ordersResponse.forEach(order => {
          if (order.items) { // Sipariş öğeleri varsa
            order.items.forEach(item => {
              const productId = item.productId; // Ürün ID'sini al
              const quantity = item.quantity;   // Adeti al
              productSales[productId] = (productSales[productId] || 0) + quantity;
            });
          }
        });

        // Ürün ID'lerini ürün isimleriyle eşleştirmek için bir harita oluştur
        const productMap = new Map(productsResponse.map(p => [p.id, p.name]));

        const sortedTopSelling = Object.entries(productSales)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5) // İlk 5 en çok satanı al
          .map(([productId, salesCount]) => ({
            name: productMap.get(productId) || `Ürün ${productId}`, // Ürün ismini kullan
            sales: salesCount
          }));

        setTopSellingProducts(sortedTopSelling);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to fetch dashboard data. Please check permissions or server status.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="admin-dashboard-home-loading">Dashboard verileri yükleniyor...</div>;
  }

  if (error) {
    return <div className="admin-dashboard-home-error">Hata: {error}</div>;
  }

  return (
    <div className="admin-dashboard-home">
      <h2>Yönetim Paneli Genel Bakış</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Toplam Kullanıcı</h3>
          <p className="stat-number">{userCount}</p>
        </div>
        <div className="stat-card">
          <h3>Toplam Ürün</h3>
          <p className="stat-number">{productCount}</p>
        </div>
        <div className="stat-card">
          <h3>Toplam Sipariş</h3>
          <p className="stat-number">{orderCount}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>En Çok Satan Ürünler</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Buraya diğer grafikler eklenebilir (örneğin kullanıcı kayıtları zamanla) */}
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h3>Son Kaydolan Kullanıcılar</h3>
          {recentUsers.length > 0 ? (
            <ul className="list-unstyled">
              {recentUsers.map(user => (
                <li key={user.id}>
                  <strong>{user.firstName} {user.lastName}</strong> ({user.email}) - Kayıt: {new Date(user.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Son kullanıcı bulunamadı.</p>
          )}
        </div>

        <div className="section-card">
          <h3>Son Siparişler</h3>
          {recentOrders.length > 0 ? (
            <ul className="list-unstyled">
              {recentOrders.map(order => (
                <li key={order.id}>
                  <strong>Sipariş #{order.id.substring(0, 8)}</strong> - Durum: {order.status} - Toplam: ₺{order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'} - Tarih: {new Date(order.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Son sipariş bulunamadı.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardHome;
