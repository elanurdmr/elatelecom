import { createContext, useState, useContext } from "react";
import api from "../utils/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = async (email, password) => {
    const res = await api("/auth/login", "POST", { email, password });
    setToken(res.token);
    localStorage.setItem("token", res.token);
    // Sadece gerekli kullanıcı bilgilerini ayarla
    if (res.user) {
      setUser({
        id: res.user.id,
        email: res.user.email,
        firstName: res.user.firstName,
        lastName: res.user.lastName,
        role: res.user.role
      });
    } else {
      setUser(null); // Kullanıcı nesnesi yoksa null yap
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
