import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';

const RegisterForm = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Las contraseñas no coinciden',
        color: '#ffffff',
        background: '#0a0a0c',
        confirmButtonColor: '#74ACDF'
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
        title: '¡Cuenta Creada!',
        text: 'Registro completado con éxito',
        color: '#ffffff',
        background: '#0a0a0c',
        showConfirmButton: false,
        timer: 1500
      });
      onClose();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error de Registro',
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
        <h2 className="text-3xl font-bold tracking-tighter text-white mb-2">Crear Cuenta</h2>
        <p className="text-white/40 text-sm">Únete a la experiencia premium</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white/50 text-[10px] uppercase font-bold tracking-widest mb-2">
            Nombre Completo
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
            placeholder="John Doe"
          />
        </div>

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
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
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
            minLength="6"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-white/50 text-[10px] uppercase font-bold tracking-widest mb-2">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full h-12 mt-6 rounded-full font-bold tracking-widest text-xs uppercase transition-all flex items-center justify-center gap-2
            ${loading ? 'bg-white/10 text-white/50 cursor-not-allowed' : 'bg-white text-black hover:bg-[#74ACDF] hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(116,172,223,0.3)]'}`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Registrarse'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-white/40 text-xs">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-white hover:text-[#74ACDF] font-medium transition-colors"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;