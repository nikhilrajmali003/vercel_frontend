import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Items from './pages/Items';
import Products from './pages/Products';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import EditItem from './pages/EditItem';
import Login from './pages/Login';
import OTP from './pages/OTP';
import Register from './pages/Register';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function AppContent() {
  const location = useLocation();
  // Hide navbar on login/register/otp pages and on dashboard/products pages (they have their own sidebar)
  const hideNavbar = 
    location.pathname === '/login' || 
    location.pathname === '/otp' || 
    location.pathname === '/register' ||
    location.pathname === '/' ||
    location.pathname === '/products';

  return (
    <div className="App">
      {!hideNavbar && <Navbar />}
      <main className={hideNavbar ? "main-content-full" : "main-content"}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/otp" element={
            <PublicRoute>
              <OTP />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          <Route path="/items" element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          } />
          <Route path="/items/:id" element={
            <ProtectedRoute>
              <ItemDetail />
            </ProtectedRoute>
          } />
          <Route path="/items/create" element={
            <ProtectedRoute>
              <CreateItem />
            </ProtectedRoute>
          } />
          <Route path="/items/:id/edit" element={
            <ProtectedRoute>
              <EditItem />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
