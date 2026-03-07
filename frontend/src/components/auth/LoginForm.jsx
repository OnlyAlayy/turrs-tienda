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

      <a
        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/google`}
        className="w-full h-12 mb-6 rounded-full font-bold tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continuar con Google
      </a>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-white/10"></div>
        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">o continuá con email</span>
        <div className="flex-1 h-px bg-white/10"></div>
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