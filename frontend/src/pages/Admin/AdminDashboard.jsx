import React, { useState } from 'react';
import './AdminDashboard.css'; // Create this CSS file for styling
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard', 'users', 'products', 'orders'

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <h1>Welcome to the Admin Dashboard</h1>
            <p>Select a section from the sidebar to manage your store.</p>
          </>
        );
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><a href="#" onClick={() => setActiveSection('dashboard')}>Dashboard</a></li>
          <li><a href="#" onClick={() => setActiveSection('users')}>Users</a></li>
          <li><a href="#" onClick={() => setActiveSection('products')}>Products</a></li>
          <li><a href="#" onClick={() => setActiveSection('orders')}>Orders</a></li>
        </ul>
      </aside>
      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
