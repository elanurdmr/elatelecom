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
      // const response = await api("/cart/add", "POST", {
      //   productId: product.id,
      //   quantity: 1,
      // });
      // // Assuming the backend returns the updated cart item or a success message
      // // You might want to refetch the entire cart here or update state more granularly
      // setCartItems((prev) => {
      //   const existingItemIndex = prev.findIndex(item => item.productId === product.id);
      //   if (existingItemIndex > -1) {
      //     const newCartItems = [...prev];
      //     newCartItems[existingItemIndex].quantity += 1;
      //     return newCartItems;
      //   } else {
      //     return [...prev, { ...product, quantity: 1, id: response.id }]; // Assuming response contains the new cart item ID
      //   }
      // });
      await api("/cart/add", "POST", { productId: product.id, quantity: 1 });
      // After adding, refetch the cart to ensure consistency and immediate UI update
      const cartResponse = await api("/cart/items", "GET");
      setCartItems(cartResponse || []);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optionally show an error to the user
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
      // Assuming the backend returns the updated user object or just a success status
      // For immediate UI feedback, we can optimistically update the state
      await api(`/favorites/toggle/${productId}`, "POST");
      // Optimistically update favoriteIds or refetch
      setFavoriteIds((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId);
        } else {
          return [...prev, productId];
        }
      });
      // Optionally, refetch user data to ensure persisted favorites are loaded
      // This would require an API endpoint to fetch the full user object including favorites
      // For now, optimistic update is faster.
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      // Optionally show an error to the user
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, cartItems, addToCart, favoriteIds, toggleFavorite, isAuthModalOpen, setIsAuthModalOpen, updateCartItemQuantity, removeCartItem }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
