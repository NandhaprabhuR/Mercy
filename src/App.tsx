import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthView from './views/AuthView';
import StorefrontView from './views/StorefrontView';
import ProductDetailView from './views/ProductDetailView';
import CartView from './views/CartView';
import CheckoutView from './views/CheckoutView';
import ProfileView from './views/ProfileView';
import EditProfileView from './views/EditProfileView';
import AddressBookView from './views/AddressBookView';
import OrdersView from './views/OrdersView';
import OrderTrackingView from './views/OrderTrackingView';
import OrderReturnView from './views/OrderReturnView';
import OrderFeedbackView from './views/OrderFeedbackView';
import OrderInvoiceView from './views/OrderInvoiceView';
import ReviewsView from './views/ReviewsView';

import AdminLayout from './views/admin/AdminLayout';
import AdminOverview from './views/admin/AdminOverview';
import AdminProductList from './views/admin/AdminProductList';
import AdminAddProduct from './views/AdminDashboard';
import AdminUserList from './views/admin/AdminUserList';
import AdminOrderList from './views/admin/AdminOrderList';

import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ToastContainer';
import { useAuth } from './context/AuthContext';
import './App.css';

// Root redirect handler
function HomeRoute() {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  return <StorefrontView />;
}

// Layout wrapper
function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      <ToastContainer />
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? "main-content" : "admin-main-wrapper"}>
        <Routes>
          {/* Public or shared routes */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="/products/:id" element={<ProductDetailView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/login" element={<AuthView />} />

          {/* Protected Consumer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['CONSUMER']} />}>
            <Route path="/checkout" element={<CheckoutView />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/edit" element={<EditProfileView />} />
            <Route path="/profile/orders" element={<OrdersView />} />
            <Route path="/profile/orders/:id/track" element={<OrderTrackingView />} />
            <Route path="/profile/orders/:id/return" element={<OrderReturnView />} />
            <Route path="/profile/orders/:id/feedback" element={<OrderFeedbackView />} />
            <Route path="/profile/orders/:id/invoice" element={<OrderInvoiceView />} />
            <Route path="/profile/addresses" element={<AddressBookView />} />
            <Route path="/profile/reviews" element={<ReviewsView />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="products" element={<AdminProductList />} />
              <Route path="products/add" element={<AdminAddProduct />} />
              <Route path="users" element={<AdminUserList />} />
              <Route path="orders" element={<AdminOrderList />} />
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
