import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74ACDF]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: 'Acceso restringido',
      text: 'Debes iniciar sesión para acceder a esta página',
      color: '#ffffff',
      background: '#0a0a0c',
      confirmButtonColor: '#74ACDF'
    });
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes permisos para acceder a esta página',
      color: '#ffffff',
      background: '#0a0a0c',
      confirmButtonColor: '#74ACDF'
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;