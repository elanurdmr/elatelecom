import React, { useState } from 'react';
import './AdminDashboard.css'; // Create this CSS file for styling
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import AdminDashboardHome from './AdminDashboardHome'; // Import the new component

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard', 'users', 'products', 'orders'

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboardHome />;
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
      <nav className="admin-navbar">
        <div className="admin-navbar-brand">
          Admin Panel
        </div>
        <ul className="admin-nav-links">
          <li><button type="button" className={activeSection === 'dashboard' ? 'active' : ''} onClick={() => setActiveSection('dashboard')}>Dashboard</button></li>
          <li><button type="button" className={activeSection === 'users' ? 'active' : ''} onClick={() => setActiveSection('users')}>Users</button></li>
          <li><button type="button" className={activeSection === 'products' ? 'active' : ''} onClick={() => setActiveSection('products')}>Products</button></li>
          <li><button type="button" className={activeSection === 'orders' ? 'active' : ''} onClick={() => setActiveSection('orders')}>Orders</button></li>
        </ul>
      </nav>
      
      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
