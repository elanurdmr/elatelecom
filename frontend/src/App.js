import { Routes, Route } from "react-router-dom";
import { useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Footer from "./components/Footer";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import OrderTracking from "./pages/OrderTracking";
import GlobalAlert from "./components/GlobalAlert"; // Import GlobalAlert

function App() {
  const location = useLocation(); // Get current location
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <AppProvider>
        {!isAdminRoute && <Navbar />} {/* Conditionally render Navbar */}
        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order-tracking/:orderId?" element={<OrderTracking />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <GlobalAlert /> {/* Add GlobalAlert component here */}
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
