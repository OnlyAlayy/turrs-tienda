import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const LoginForm = ({ onSwitchToRegister, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Login exitoso!',
        text: 'Bienvenido de vuelta',
        timer: 2000,
        showConfirmButton: false
      });
      onClose();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: result.message
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="font-turrs-title text-2xl text-turrs-blue mb-6 text-center">Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-turrs py-2 px-4 disabled:opacity-50"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToRegister}
          className="font-turrs-text text-turrs-blue hover:underline"
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </div>
  );
};

export default LoginForm;