// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turrs-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: 'Acceso restringido',
      text: 'Debes iniciar sesión para acceder a esta página'
    });
    return <Navigate to="/login" replace />; // ✅ Cambiado a /login
  }

  if (requiredRole && user?.role !== requiredRole) { // ✅ Agregado operador de encadenamiento opcional
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes permisos para acceder a esta página'
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;