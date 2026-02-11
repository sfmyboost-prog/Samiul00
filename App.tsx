import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';

// Public Views
import PublicLayout from './layouts/PublicLayout';
import Home from './views/public/Home';
import ProductDetail from './views/public/ProductDetail';
import Cart from './views/public/Cart';
import CategoryPage from './views/public/CategoryPage';
import MobileCategories from './views/public/MobileCategories';
import Account from './views/public/Account';
import Login from './views/public/Login';
import Register from './views/public/Register';
import Checkout from './views/public/Checkout';
import SearchResults from './views/public/SearchResults';
import CoinsPage from './views/public/CoinsPage';
import Wishlist from './views/public/Wishlist';

// Admin Views
import AdminLayout from './views/admin/AdminLayout';
import AdminLogin from './views/admin/AdminLogin';
import Dashboard from './views/admin/Dashboard';
import ProductsManagement from './views/admin/ProductsManagement';
import CategoriesManagement from './views/admin/CategoriesManagement';
import OrdersManagement from './views/admin/OrdersManagement';
import CustomersManagement from './views/admin/CustomersManagement';
import MediaManagement from './views/admin/MediaManagement';
import StoreSettings from './views/admin/StoreSettings';
import TwoFactorManagement from './views/admin/TwoFactorManagement';

const AdminRouteGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAdmin } = useStore();
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

const UserRouteGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isLoggedIn } = useStore();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/product/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
      <Route path="/category/:slug" element={<PublicLayout><CategoryPage /></PublicLayout>} />
      <Route path="/categories" element={<PublicLayout><MobileCategories /></PublicLayout>} />
      <Route path="/account" element={<PublicLayout><Account /></PublicLayout>} />
      
      {/* Protected User Routes */}
      <Route path="/cart" element={<UserRouteGuard><PublicLayout><Cart /></PublicLayout></UserRouteGuard>} />
      <Route path="/wishlist" element={<UserRouteGuard><PublicLayout><Wishlist /></PublicLayout></UserRouteGuard>} />
      <Route path="/checkout" element={<UserRouteGuard><PublicLayout><Checkout /></PublicLayout></UserRouteGuard>} />
      <Route path="/coins" element={<UserRouteGuard><PublicLayout><CoinsPage /></PublicLayout></UserRouteGuard>} />

      <Route path="/search" element={<PublicLayout><SearchResults /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminRouteGuard><AdminLayout><Dashboard /></AdminLayout></AdminRouteGuard>} />
      <Route path="/admin/products" element={<AdminRouteGuard><AdminLayout><ProductsManagement /></AdminLayout></AdminRouteGuard>} />
      <Route path="/admin/categories" element={<AdminRouteGuard><AdminLayout><CategoriesManagement /></AdminLayout></AdminRouteGuard>} />
      <Route path="/admin/media" element={<AdminRouteGuard><AdminLayout><MediaManagement /></AdminLayout></AdminRouteGuard>} />
      <Route path="/admin/orders" element={<AdminRouteGuard><AdminLayout><OrdersManagement /></AdminLayout></AdminRouteGuard>} />
      <Route path="/admin/customers" element={<AdminRouteGuard><AdminLayout><CustomersManagement /></AdminLayout></AdminRouteGuard>} />
      <Route path="/admin/report" element={<AdminRouteGuard><AdminLayout><div className="text-2xl font-bold p-8">Analytics Reports</div></AdminLayout></AdminRouteGuard>} />
      <Route path="/admin/auth" element={<AdminRouteGuard><AdminLayout><TwoFactorManagement /></AdminLayout></AdminRouteGuard>} />
      <Route path="/admin/settings" element={<AdminRouteGuard><AdminLayout><StoreSettings /></AdminLayout></AdminRouteGuard>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
};

export default App;