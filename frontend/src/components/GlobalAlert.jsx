import React from 'react';
import './GlobalAlert.css'; // We'll create this CSS file next
import { useAuth } from '../context/AuthContext';

const GlobalAlert = () => {
  const { message, messageType } = useAuth();

  if (!message) return null;

  return (
    <div className={`global-alert ${messageType || 'success'}`}>
      {message}
    </div>
  );
};

export default GlobalAlert;
