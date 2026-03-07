import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const OnboardingModal = () => {
    const { user, token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', dni: '', phone: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only show if user is logged in, profile is NOT complete, and user is not admin
        if (user && !user.profileComplete && user.role !== 'admin') {
            setIsOpen(true);
            setFormData({
                firstName: user.firstName || (user.name ? user.name.split(' ')[0] : ''),
                lastName: user.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
                dni: user.dni || '',
                phone: user.phone || ''
            });
        } else {
            setIsOpen(false);
        }
    }, [user]);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'dni') value = value.replace(/[^0-9]/g, '');
        if (name === 'phone') value = value.replace(/[^0-9+ ]/g, '');
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire({
                icon: 'success',
                title: 'Perfil Completado',
                text: 'Gracias por completar tus datos. Ahora puedes agilizar tus compras.',
                background: '#0a0a0c',
                color: '#fff',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            }).then(() => {
                window.location.reload(); // reload to get new user state 
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Verificá tus datos y volvé a intentar.',
                background: '#0a0a0c',
                color: '#fff',
                confirmButtonColor: '#74ACDF'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="onboarding-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                >
                    <motion.div
                        key="onboarding-modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
                        className="relative z-[201] w-full max-w-[500px]"
                    >
                        <div className="relative bg-[#0A0A0C] border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden">

                            {/* Decorative elements */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#74ACDF] to-transparent opacity-50 z-0"></div>
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#74ACDF]/10 rounded-full blur-3xl pointer-events-none z-0"></div>

                            <div className="relative z-10 w-full">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold tracking-tighter text-white mb-2">Completá tus datos</h2>
                                    <p className="text-white/40 text-sm">Necesitamos esta información para agilizar tus envíos y facturación.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-white/50 text-[10px] uppercase font-bold tracking-widest mb-2">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/50 text-[10px] uppercase font-bold tracking-widest mb-2">
                                                Apellido
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
                                                placeholder="Tu apellido"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white/50 text-[10px] uppercase font-bold tracking-widest mb-2">
                                            DNI / CUIT / Pasaporte
                                        </label>
                                        <input
                                            type="text"
                                            name="dni"
                                            value={formData.dni}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
                                            placeholder="XX.XXX.XXX"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white/50 text-[10px] uppercase font-bold tracking-widest mb-2">
                                            Teléfono de Contacto
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] focus:bg-black/60 transition-all placeholder:text-white/20"
                                            placeholder="+54 11 ..."
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
                                            'Guardar y Continuar'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingModal;
