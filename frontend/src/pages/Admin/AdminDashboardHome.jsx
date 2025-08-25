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

  // Helper to fetch product details for favorite IDs
  const fetchProductDetails = useCallback(async (productIds) => {
    try {
      const products = await Promise.all(
        productIds.map(id => api(`/products/${id}`, 'GET', null, token))
      );
      return products;
    } catch (err) {
      console.error("Failed to fetch product details for favorites:", err);
      return [];
    }
  }, [token]); // Add token to useCallback dependency array

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch User Count and Recent Users
        const users = await api('/admin/users', 'GET', null, token);
        setUserCount(users.length);
        setRecentUsers(users.slice(0, 5)); // Get top 5 recent users

        // Fetch Product Count
        const products = await api('/products', 'GET', null, token); // Using non-admin endpoint for products
        setProductCount(products.length);

        // Fetch Order Count and Recent Orders
        const orders = await api('/admin/orders', 'GET', null, token);
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
    return <div className="admin-dashboard-home-loading">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="admin-dashboard-home-error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard-home">
      <h2>Dashboard Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{userCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{productCount}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{orderCount}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h3>Recent Users</h3>
          {recentUsers.length > 0 ? (
            <ul className="list-unstyled">
              {recentUsers.map(user => (
                <li key={user.id}><strong>{user.firstName} {user.lastName}</strong> ({user.email}) - Joined: {new Date(user.createdAt).toLocaleDateString()}</li>
              ))}
            </ul>
          ) : (
            <p>No recent users.</p>
          )}
        </div>

        <div className="section-card">
          <h3>Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <ul className="list-unstyled">
              {recentOrders.map(order => (
                <li key={order.id}><strong>Order #{order.orderNumber}</strong> - Status: {order.status} - Total: ₺{(order.totalPrice || 0).toFixed(2)} - Date: {new Date(order.createdAt).toLocaleDateString()}</li>
              ))}
            </ul>
          ) : (
            <p>No recent orders.</p>
          )}
        </div>

        <div className="section-card">
          <h3>Top Favorite Products</h3>
          {topFavoriteProducts.length > 0 ? (
            <ul className="list-unstyled">
              {topFavoriteProducts.map(product => (
                <li key={product.id}><strong>{product.name}</strong> - Favorited: {product.favoriteCount} times</li>
              ))}
            </ul>
          ) : (
            <p>No favorite products found or data not available.</p>
          )}
        </div>
      </div>
      {/* You can add more detailed charts or lists here */}
    </div>
  );
};

export default AdminDashboardHome;
