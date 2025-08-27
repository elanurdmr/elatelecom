import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from "../utils/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [cartItems, setCartItems] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [message, setMessage] = useState(null); // State for global messages
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'
  const navigate = useNavigate(); // Initialize useNavigate

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch cart and favorites on initial load if user is authenticated
  useEffect(() => {
    if (user && token) {
      const fetchInitialData = async () => {
        try {
          const cartResponse = await api("/cart/items", "GET");
          setCartItems(cartResponse || []);
        } catch (error) {
          console.error("Failed to fetch initial cart items:", error);
          setCartItems([]);
        }
        try {
          const favResponse = await api("/favorites", "GET");
          setFavoriteIds(favResponse || []);
        } catch (error) {
          console.error("Failed to fetch initial favorite items:", error);
          setFavoriteIds([]);
        }
      };
      fetchInitialData();
    }
  }, [user, token]); // Re-run when user or token changes

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3000); // Message disappears after 3 seconds
  };

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
      setFavoriteIds(res.user.favoriteProductIds || []); // Set favorite IDs on login
      // Fetch cart items after successful login
      try {
        const cartResponse = await api("/cart/items", "GET");
        setCartItems(cartResponse || []);
      } catch (error) {
        console.error("Failed to fetch cart items after login:", error);
        setCartItems([]);
      }
      localStorage.setItem("user", JSON.stringify(res.user)); // Persist user object
      
      // Redirect based on user role
      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } else {
      setUser(null); // Kullanıcı nesnesi yoksa null yap
      setFavoriteIds([]);
      setCartItems([]);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Remove user object from localStorage
    setCartItems([]); // Clear cart on logout
    setFavoriteIds([]); // Clear favorites on logout
    navigate('/'); // Redirect to home page after logout
  };

  const addToCart = async (product) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      await api("/cart/add", "POST", { 
        productId: product.id, 
        productName: product.name, 
        productImage: product.image, 
        productPrice: product.price, 
        quantity: 1 
      });
      const cartResponse = await api("/cart/items", "GET");
      setCartItems(cartResponse || []);
      showMessage("Ürün sepete eklendi!", "success");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      showMessage("Sepete eklenirken bir hata oluştu.", "error");
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (!user) return setIsAuthModalOpen(true);
    try {
      await api(`/cart/update/${productId}`, "PUT", { quantity });
      const cartResponse = await api("/cart/items", "GET");
      setCartItems(cartResponse || []);
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  };

  const removeCartItem = async (productId) => {
    if (!user) return setIsAuthModalOpen(true);
    try {
      await api(`/cart/remove/${productId}`, "DELETE");
      const cartResponse = await api("/cart/items", "GET");
      setCartItems(cartResponse || []);
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const updatedUser = await api(`/favorites/toggle/${productId}`, "POST");
      console.log("Updated user from backend:", updatedUser); // Debugging line
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setFavoriteIds(updatedUser.favoriteProductIds || []); // Update favoriteIds from the updated user

      const isFavorited = updatedUser.favoriteProductIds.includes(productId);
      showMessage(isFavorited ? "Ürün favorilere eklendi!" : "Ürün favorilerden kaldırıldı!", "success");

    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      showMessage("Favori güncellenirken bir hata oluştu.", "error");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, cartItems, addToCart, favoriteIds, toggleFavorite, isAuthModalOpen, setIsAuthModalOpen, updateCartItemQuantity, removeCartItem, message, messageType, showMessage }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
