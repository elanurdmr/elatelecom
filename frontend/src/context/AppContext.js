import React, { createContext, useContext, useMemo } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const value = useMemo(() => ({
  }), []);

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
