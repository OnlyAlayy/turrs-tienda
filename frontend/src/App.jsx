  // frontend/src/App.jsx
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import { AuthProvider } from './contexts/AuthContext';
  import { CartProvider } from './contexts/CartContext';
  import { OrderProvider } from './contexts/OrderContext';
  import Header from './components/Header';
  import Footer from './components/Footer';
  import Home from './pages/Home';
  import Products from './pages/Products';
  import ProductDetail from './pages/ProductDetail';
  import Cart from './pages/Cart';
  import Checkout from './pages/Checkout';
  import OrderConfirmation from './pages/OrderConfirmation';
  import AdminDashboard from './pages/admin/AdminDashboard';
  import ProtectedRoute from './components/ProtectedRoute';

  function App() {
    return (
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <Router>
              <div className="min-h-screen bg-turrs-white flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    {/* Rutas públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} /> {/* ✅ Corregido a /products/:id */}
                    
                    {/* Rutas protegidas */}
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
                      path="/order-confirmation/:orderId" 
                      element={
                        <ProtectedRoute>
                          <OrderConfirmation />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Ruta de admin */}
                    <Route 
                      path="/admin-dashboard"  // ✅ Cambiado a /admin-dashboard para coincidir con Header
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    );
  }

  export default App;