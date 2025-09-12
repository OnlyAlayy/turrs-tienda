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
              {/* Header global */}
              <Header />

              {/* Contenido principal */}
              <main className="flex-grow">
                <Routes>
                  {/* Página principal */}
                  <Route path="/" element={<Home />} />

                  {/* Página de productos */}
                  <Route path="/products" element={<Products />} />

                  {/* Detalle de producto */}
                  <Route path="/product/:id" element={<ProductDetail />} />

                  {/* Carrito */}
                  <Route path="/cart" element={<Cart />} />

                  {/* Checkout */}
                  <Route path="/checkout" element={<Checkout />} />

                  {/* Confirmación de pedido */}
                  <Route
                    path="/order-confirmation/:orderId"
                    element={<OrderConfirmation />}
                  />

                  {/* Panel de administración protegido */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>

              {/* Footer global */}
              <Footer />
            </div>
          </Router>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
