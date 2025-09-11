import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import Navigation from './Navigation';

const Header = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    // Mostrar alerta de logout
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

            {/* User Actions */}
            <div className="flex items-center space-x-4">
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