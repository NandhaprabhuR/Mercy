import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthView from './views/AuthView';
import StorefrontView from './views/StorefrontView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import ProfileView from './views/ProfileView';

import AdminLayout from './views/admin/AdminLayout';
import DashboardOverview from './views/admin/DashboardOverview';
import AdminProductList from './views/admin/AdminProductList';
import AdminAddProduct from './views/AdminDashboard'; // We reuse our old form as the Add form
import AdminUserList from './views/admin/AdminUserList';

import ProtectedRoute from './components/ProtectedRoute';
import './App.css'; // Triggering save to clear dev server lint cache again

// Layout wrapper for Consumer routes
function AppLayout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public or shared routes */}
          <Route path="/" element={<StorefrontView />} />
          <Route path="/products/:id" element={<ProductDetailView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/login" element={<AuthView />} />

          {/* Protected Consumer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CONSUMER']} />}>
            <Route path="/checkout" element={<CheckoutView />} />
            <Route path="/profile" element={<ProfileView />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="products" element={<AdminProductList />} />
              <Route path="products/add" element={<AdminAddProduct />} />
              <Route path="users" element={<AdminUserList />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
