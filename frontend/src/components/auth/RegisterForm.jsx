import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const RegisterForm = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Cuenta creada correctamente',
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
      <h2 className="font-turrs-title text-2xl text-turrs-blue mb-6 text-center">Crear Cuenta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
            Nombre Completo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
            placeholder="Tu nombre completo"
          />
        </div>

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
            minLength="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
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
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToLogin}
          className="font-turrs-text text-turrs-blue hover:underline"
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;