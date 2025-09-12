import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import AuthModal from './auth/AuthModal';
import Navigation from './Navigation';
import Swal from 'sweetalert2';

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleLogout = () => {
    logout();
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente',
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <>
      <header className="bg-turrs-blue py-4 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="font-turrs-title text-3xl md:text-4xl text-turrs-white drop-shadow-lg">
                TURRS
              </h1>
            </Link>

            {/* Navigation */}
            <div className="hidden md:block">
              <Navigation />
            </div>

            {/* User Actions + Cart */}
            <div className="flex items-center space-x-4">
              {/* Carrito */}
              <Link
                to="/cart"
                className="relative text-turrs-white hover:text-turrs-skin transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                  />
                </svg>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-turrs-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>

              {/* User actions */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="font-turrs-text text-turrs-white">
                    Hola, {user.name}
                  </span>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="btn-turrs-red text-sm"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;
