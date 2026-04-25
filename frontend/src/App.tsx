import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Contexts
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Hooks
import { useAuth } from './context/AuthContext';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { ToastProvider } from './components/Toast';
import { ChatbotButton } from './components/ChatbotButton';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { OTPVerification } from './pages/OTPVerification';
import { ResetPassword } from './pages/ResetPassword';
import { UserProfile } from './pages/UserProfile';
import { SavedItems } from './pages/SavedItems';
import { Orders } from './pages/Orders';
import { Settings } from './pages/Settings';
import { Collections } from './pages/Collections';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { SellerSignup } from './pages/SellerSignup';
import { SellerLogin } from './pages/SellerLogin';
import { SellerDashboard } from './pages/SellerDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { About } from './pages/About';

// New Hierarchical Pages
import { PashminaCategory } from './pages/PashminaCategory';
import { YakWoolCategory } from './pages/YakWoolCategory';
import { CraftsCategory } from './pages/CraftsCategory';
import { StoleProducts } from './pages/StoleProducts';
import { MufflerProducts } from './pages/MufflerProducts';
import { WoodenCraftsProducts } from './pages/WoodenCraftsProducts';
import { PaintingsProducts } from './pages/PaintingsProducts';
import { GenericSubcategoryProducts } from './pages/GenericSubcategoryProducts';
import { ViscoseProducts } from './pages/ViscosProducts';
import { TshirtsProducts } from './pages/TshirtsProducts';
import { JewelryProducts } from './pages/JewelryProducts';

function AppContent() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isSellerRoute = location.pathname.startsWith('/seller') || location.pathname === '/sell-your-product' || location.pathname === '/seller-login';
  const isAuthRoute = ['/login', '/signup', '/forgot-password', '/verify-otp', '/reset-password', '/sell-your-product'].includes(location.pathname);

  //Auto logout sellers
  useEffect(() => {
    if (user && user.role === 'seller' && !isSellerRoute) {
      console.warn('Seller tried to access public site. Auto-logging out.');
      logout();
    }
  }, [location.pathname, user, isSellerRoute, logout]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-light dark:bg-bg-dark text-text-primary transition-colors duration-300">
      <ToastProvider/>
      {!isAdminRoute && !isSellerRoute && <Header />}

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home/>} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* User */}
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/saved-items" element={<SavedItems />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/settings" element={<Settings />} />

            {/* Shop - Main Collections */}
            <Route path="/collections" element={<Collections />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductDetail />} />

            {/* Pashmina Hierarchy */}
            {/* <Route path="/pashmina" element={<PashminaCategory />} /> */}

            {/* Specific files for items with unique logic */}
            {/* <Route path="/pashmina/stole" element={<StoleProducts />} />
            <Route path="/pashmina/muffler" element={<MufflerProducts />} /> */}

            {/* Yak Wool Hierarchy */}
            {/* <Route path="/yak-wool" element={<YakWoolCategory />} />
            <Route path="/yak-wool/blanket" element={<GenericSubcategoryProducts />} />
            <Route path="/yak-wool/pancho" element={<GenericSubcategoryProducts />} />
            <Route path="/yak-wool/sweater" element={<GenericSubcategoryProducts />} />
            <Route path="/yak-wool/shawl" element={<GenericSubcategoryProducts />} />
            <Route path="/yak-wool/muffler" element={<GenericSubcategoryProducts />} />
            <Route path="/:categoryId/:subcategoryId" element={<GenericSubcategoryProducts />} /> */}

            {/* Pashmina Hierarchy */}
            <Route path="/pashmina" element={<PashminaCategory />} />
            <Route path="/pashmina/stole" element={<StoleProducts />} />
            <Route path="/pashmina/muffler" element={<MufflerProducts />} />
            <Route path="/viscos" element={<ViscoseProducts />} />
            <Route path="/tshirts" element={<TshirtsProducts />} />
            <Route path="/jewelry" element={<JewelryProducts />} />


            {/* Yak Wool Main Page */}
            <Route path="/yak-wool" element={<YakWoolCategory />} />

            {/*This line handles all subcategories for pashmina and Yak Wool */}
            <Route path="/:categoryId/:subcategoryId" element={<GenericSubcategoryProducts />} />

            {/* Crafts & Paintings Hierarchy */}
            <Route path="/crafts" element={<CraftsCategory />} />
            <Route path="/crafts/wooden-crafts" element={<WoodenCraftsProducts />} />
            <Route path="/crafts/paintings" element={<PaintingsProducts />} />


            {/* Cart & Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment" element={<Payment />} />

            {/* Admin */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Seller */}
            <Route path="/sell-your-product" element={<SellerSignup />} />
            <Route path="/seller-login" element={<SellerLogin />} />
            <Route path="/seller-dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />

            {/* Info */}
            <Route path="/about" element={<About />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAdminRoute && !isSellerRoute && <Footer />}
      {!isAdminRoute && !isSellerRoute && <ChatbotButton />}
    </div>
  );
}

export function App() {
  return (
    <GoogleOAuthProvider clientId="98733095566-55ke63ameb75rgo9lsjnc9q46u868cuv.apps.googleusercontent.com">
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <ScrollToTop />
              <AppContent />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}