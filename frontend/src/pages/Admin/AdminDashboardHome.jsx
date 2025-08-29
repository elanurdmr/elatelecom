import React, { useState, useEffect } from 'react';
import { useCallback } from 'react'; // Import useCallback
import api from '../../utils/services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboardHome.css';

const AdminDashboardHome = () => {
  const { token } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topFavoriteProducts, setTopFavoriteProducts] = useState([]);

  const getTranslatedStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Hazırlanıyor';
      case 'CONFIRMED':
        return 'Onaylandı';
      case 'PROCESSING':
        return 'İşleniyor';
      case 'SHIPPED':
        return 'Yola Çıktı';
      case 'DELIVERED':
        return 'Teslim Edildi';
      case 'CANCELLED':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  // Helper to fetch product details for favorite IDs
  const fetchProductDetails = useCallback(async (productIds) => {
    try {
      const productsPromises = productIds.map(async (id) => {
        try {
          return await api(`products/${id}`, 'GET', null, token);
        } catch (err) {
          console.warn(`Failed to fetch product details for ID ${id}:`, err);
          return null; // Return null for failed individual product fetches
        }
      });
      const products = await Promise.all(productsPromises);
      return products.filter(Boolean); // Filter out any null values
    } catch (err) {
      console.error("Failed to fetch product details for favorites overall:", err);
      return [];
    }
  }, [token]); // Add token to useCallback dependency array

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Count and Recent Users
        const users = await api('admin/users', 'GET', null, token);
        setUserCount(users.length);
        setRecentUsers(users.slice(0, 5)); // Get top 5 recent users

        // Fetch Product Count
        const products = await api('products', 'GET', null, token); // Using non-admin endpoint for products
        setProductCount(products.length);

        // Fetch Order Count and Recent Orders
        const orders = await api('admin/orders', 'GET', null, token);
        setOrderCount(orders.length);
        setRecentOrders(orders.slice(0, 5)); // Get top 5 recent orders

        // Calculate Top Favorite Products
        const allFavoriteProductIds = users.flatMap(user => user.favoriteProductIds || []);
        const favoriteCounts = allFavoriteProductIds.reduce((acc, id) => {
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});

        const sortedFavoriteProductIds = Object.entries(favoriteCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .map(([id]) => id)
          .slice(0, 5); // Get top 5 favorite product IDs

        const detailedTopFavorites = await fetchProductDetails(sortedFavoriteProductIds);
        setTopFavoriteProducts(detailedTopFavorites.map(prod => ({ ...prod, favoriteCount: favoriteCounts[prod.id] })));

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data. Please check permissions or server status.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, fetchProductDetails]); // Add fetchProductDetails to dependency array

  if (loading) {
    return <div className="admin-dashboard-home-loading">Panel verileri yükleniyor...</div>;
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

      <div className="dashboard-sections">
        <div className="section-card">
          <h3>Son Kullanıcılar</h3>
          {recentUsers.length > 0 ? (
            <ul className="list-unstyled">
              {recentUsers.map(user => (
                <li key={user.id}><strong>{user.firstName} {user.lastName}</strong> ({user.email}) - Katılma Tarihi: {new Date(user.createdAt).toLocaleDateString()}</li>
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
                <li key={order.id}><strong>Sipariş No: {order.orderNumber}</strong> - Durum: {getTranslatedStatus(order.status)} - Toplam: ₺{(order.total || 0).toFixed(2)} - Tarih: {new Date(order.createdAt).toLocaleDateString()}</li>
              ))}
            </ul>
          ) : (
            <p>Son sipariş bulunamadı.</p>
          )}
        </div>

        <div className="section-card">
          <h3>En Çok Favorilenen Ürünler</h3>
          {topFavoriteProducts.length > 0 ? (
            <ul className="list-unstyled">
              {topFavoriteProducts.map(product => (
                <li key={product.id}><strong>{product.name}</strong> - Favorilenme: {product.favoriteCount} kez</li>
              ))}
            </ul>
          ) : (
            <p>Favori ürün bulunamadı veya veri mevcut değil.</p>
          )}
        </div>
      </div>
      {/* You can add more detailed charts or lists here */}
    </div>
  );
};

export default AdminDashboardHome;
