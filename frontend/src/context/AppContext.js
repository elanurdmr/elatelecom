import React, { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const addToCart = (product) => {
    setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
  };

  const toggleFavorite = (productId) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const value = useMemo(() => ({
    isLoggedIn,
    setIsLoggedIn,
    cartItems,
    addToCart,
    favoriteIds,
    toggleFavorite,
    isAuthModalOpen,       // modal açık/kapalı durumu
    setIsAuthModalOpen     // modal'ı açıp kapatma fonksiyonu
  }), [isLoggedIn, cartItems, favoriteIds, isAuthModalOpen]);

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
