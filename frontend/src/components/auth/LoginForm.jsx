import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const LoginForm = ({ onSwitchToRegister, onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: '¡Sesión Iniciada!',
        text: 'Bienvenido de vuelta',
        color: '#ffffff',
        background: '#0a0a0c',
        showConfirmButton: false,
        timer: 1500
      });

      if (typeof onClose === 'function') {
        onClose();
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: result.message,
        color: '#ffffff',
        background: '#0a0a0c',
        confirmButtonColor: '#74ACDF'
      });
    }

    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tighter text-white mb-2">Bienvenido</h2>
        <p className="text-white/40 text-sm">Ingresa a tu cuenta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-white/50 text-[10px] uppercase font-bold tracking-widest mb-2">
            Correo Electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-white/50 text-[10px] uppercase font-bold tracking-widest mb-2">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 mt-4 rounded-full font-bold tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-2
            ${loading ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-white text-black hover:bg-[#74ACDF] hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(116,172,223,0.3)]'}`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Iniciar Sesión'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-white/40 text-xs">
          ¿Aún no tienes cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-white hover:text-[#74ACDF] font-medium transition-colors"
          >
            Crear una ahora
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;