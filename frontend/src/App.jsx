// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';

// Pages & Components
import PageWrapper from './components/layout/PageWrapper';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import StorePage from './pages/StorePage';
import CollectionPage from './pages/CollectionPage';
import ProductPage from './pages/ProductPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>

            <Routes>
              {/* Landing Page Scrollytelling - Sin envoltorio global para control total */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/argentina2026" element={<LandingPage />} />

              {/* Legacy Home Redirect - opcional, asegura que /home envíe a la landing */}
              <Route path="/home" element={<Navigate to="/" replace />} />

              {/* Rutas Públicas de la Tienda y Privadas (Envueltas en PageWrapper) */}
              <Route
                path="/*"
                element={
                  <PageWrapper>
                    <Routes>
                      {/* Tienda Publica */}
                      <Route path="/tienda" element={<StorePage />} />
                      <Route path="/coleccion/:brand" element={<CollectionPage />} />
                      <Route path="/producto/:id" element={<ProductPage />} />

                      {/* Redirecciones de rutas legacy si existen */}
                      <Route path="/products" element={<Navigate to="/tienda" replace />} />
                      <Route path="/products/:id" element={<Navigate to="/tienda" replace />} />

                      {/* Rutas Privadas / Protegidas */}
                      <Route
                        path="/cart"
                        element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/checkout"
                        element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/mis-pedidos"
                        element={
                          <ProtectedRoute>
                            <OrdersPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/order-confirmation/:orderId"
                        element={
                          <ProtectedRoute>
                            <OrderConfirmation />
                          </ProtectedRoute>
                        }
                      />

                      {/* Rutas de admin */}
                      <Route
                        path="/admin-dashboard"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/*"
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* Not Found / 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </PageWrapper>
                }
              />
            </Routes>

          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;