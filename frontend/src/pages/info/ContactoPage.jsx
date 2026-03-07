import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ContactoPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email inválido";
        }
        if (!formData.subject) newErrors.subject = "Seleccioná un asunto";
        if (!formData.message.trim() || formData.message.length < 10) {
            newErrors.message = "El mensaje debe tener al menos 10 caracteres";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setStatus('loading');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] min-h-screen text-white pt-24 pb-16"
        >
            <div className="max-w-5xl mx-auto px-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#74ACDF] bg-clip-text text-transparent mb-2">
                    Contacto
                </h1>
                <p className="text-white/40 text-base mb-12">
                    Respondemos todos los mensajes en menos de 24 horas hábiles.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* INFO COLUMN */}
                    <div>
                        <h2 className="text-white/70 font-semibold text-lg mb-6">Canales de atención</h2>

                        <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 mb-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <div>
                                    <h3 className="text-white/80 font-medium">Email</h3>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-white/40 text-sm mt-1">hola@turrs.com</p>
                                <p className="text-white/30 text-xs mt-1">Respondemos en 24-48hs hábiles</p>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 mb-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.161.453-.834.815-1.157.884-.259.055-.588.083-1.69-.374-1.332-.55-2.221-1.923-2.288-2.013-.067-.09-.545-.726-.545-1.385s.345-.98.473-1.114c.12-.124.281-.157.382-.157.102 0 .204.004.288.008.088.005.213-.021.326.251.115.275.39.953.424 1.023.033.07.054.153.013.237-.04.085-.062.137-.123.21-.06.072-.125.155-.181.218-.06.066-.123.136-.053.256.07.12.312.515.669.836.46.413.848.542.968.601.12.06.189.05.26-.032.072-.083.313-.364.397-.489.083-.124.166-.104.275-.064.11.04 69.324.779 1.15.08.109.136.166.388.161.453zm-3.392-12.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10z" /></svg>
                                <div>
                                    <h3 className="text-white/80 font-medium">WhatsApp</h3>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-white/40 text-sm mt-1">+54 9 11 XXXX-XXXX</p>
                                <a href="https://wa.me/5491100000000" target="_blank" rel="noopener noreferrer" className="bg-green-600/20 text-green-400 border border-green-600/20 rounded-xl px-4 py-2 text-sm mt-3 inline-block hover:bg-green-600/30 transition">
                                    Escribinos ahora →
                                </a>
                                <p className="text-white/30 text-xs mt-2">Lunes a viernes 9-18hs</p>
                            </div>
                        </div>

                        <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 mb-4">
                            <div className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                    <h3 className="text-white/80 font-medium">Horarios de atención</h3>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-white/40 text-sm mt-1">Lunes a Viernes: 9:00 - 18:00hs</p>
                                <p className="text-white/40 text-sm">Sábados: 10:00 - 14:00hs</p>
                                <p className="text-white/30 text-xs mt-1">Domingos y feriados: cerrado</p>
                            </div>
                        </div>

                        <h3 className="text-white/40 text-xs tracking-[0.3em] uppercase mt-8 mb-4">Seguinos en redes</h3>
                        <div className="flex gap-4">
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white/60 transition text-2xl">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                            <a href="https://x.com" target="_blank" rel="noreferrer" className="text-white/20 hover:text-white/60 transition text-2xl">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* FORM COLUMN */}
                    <div>
                        <h2 className="text-white/70 font-semibold text-lg mb-6">Envianos un mensaje</h2>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-20 bg-[#0A0A0C] border border-white/5 rounded-2xl text-center"
                            >
                                <svg className="w-16 h-16 text-[#74ACDF] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <h3 className="text-[#74ACDF] text-2xl font-bold">✓ Mensaje recibido</h3>
                                <p className="text-white/50 text-base mt-2">Te respondemos en menos de 24 horas hábiles.</p>
                                <Link to="/" className="text-white/30 text-sm underline mt-6 hover:text-white/60 transition">
                                    Volver al inicio
                                </Link>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nombre*"
                                        className="bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 focus:outline-none focus:ring-0 transition-colors duration-200"
                                    />
                                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email*"
                                        className="bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 focus:outline-none focus:ring-0 transition-colors duration-200"
                                    />
                                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className={`bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 w-full focus:border-[#74ACDF]/50 focus:outline-none focus:ring-0 transition-colors duration-200 ${!formData.subject ? 'text-white/20' : 'text-white'}`}
                                    >
                                        <option value="" disabled>Seleccioná un asunto...</option>
                                        <option value="Consulta sobre un pedido" className="text-white">Consulta sobre un pedido</option>
                                        <option value="Cambio o devolución" className="text-white">Cambio o devolución</option>
                                        <option value="Consulta sobre un producto" className="text-white">Consulta sobre un producto</option>
                                        <option value="Problema con el pago" className="text-white">Problema con el pago</option>
                                        <option value="Otro" className="text-white">Otro</option>
                                    </select>
                                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                                </div>
                                <div>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Mensaje*"
                                        rows="5"
                                        className="bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white w-full placeholder:text-white/20 focus:border-[#74ACDF]/50 focus:outline-none focus:ring-0 transition-colors duration-200"
                                    />
                                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-400 text-sm">Error al enviar. Intentá de nuevo.</p>
                                )}

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={status === 'loading'}
                                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#74ACDF] to-[#C9A84C] text-white font-bold text-base flex justify-center items-center mt-2"
                                >
                                    {status === 'loading' ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : 'Enviar mensaje'}
                                </motion.button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactoPage;
