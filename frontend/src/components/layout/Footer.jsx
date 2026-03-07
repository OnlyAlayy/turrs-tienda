import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus('error');
            return;
        }
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus(''), 4000);
    };

    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 text-white selection:bg-[#74ACDF]/30">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link to="/" className="inline-block">
                            <span className="text-white font-bold tracking-tight text-xl flex items-center gap-1">
                                TURRS
                            </span>
                        </Link>
                        <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                            Equipamiento deportivo premium, botines de alta performance y fragancias exclusivas en un solo lugar.
                        </p>

                        <form onSubmit={handleSubscribe} className={`mt-8 flex items-center max-w-sm border-b transition-colors ${status === 'error' ? 'border-red-500' : status === 'success' ? 'border-green-500' : 'border-white/20 hover:border-white/50 focus-within:border-white'}`}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={status === 'success' ? "¡Gracias por suscribirte!" : "Ingresa tu email para novedades"}
                                className="bg-transparent border-none outline-none text-sm py-3 w-full text-white placeholder:text-white/30"
                            />
                            <button type="submit" className={`uppercase tracking-widest text-[10px] font-bold transition-colors ${status === 'success' ? 'text-green-500' : status === 'error' ? 'text-red-500' : 'text-white/50 hover:text-white'}`}>
                                {status === 'success' ? 'OK' : 'Suscribir'}
                            </button>
                        </form>
                    </div>

                    {/* Tienda Links */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-6">Colecciones</h4>
                        <ul className="space-y-4 text-sm font-medium text-white/70">
                            <li><Link to="/tienda/camiseta-argentina-2026-titular" className="hover:text-white transition-colors">Argentina 2026</Link></li>
                            <li><Link to="/coleccion/adidas" className="hover:text-white transition-colors">Indumentaria Adidas</Link></li>
                            <li><Link to="/coleccion/nike" className="hover:text-white transition-colors">Calzado Futbol</Link></li>
                            <li><Link to="/coleccion/perfumes" className="hover:text-white transition-colors">Perfumería Clásica</Link></li>
                            <li><Link to="/tienda" className="text-[#74ACDF] hover:text-white transition-colors mt-2 inline-block">Ver Catalogo →</Link></li>
                        </ul>
                    </div>

                    {/* Ayuda Links */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold mb-6">Soporte</h4>
                        <ul className="space-y-4 text-sm font-medium text-white/70">
                            <li><Link to="/envios" className="hover:text-white transition-colors">Envíos y Entregas</Link></li>
                            <li><Link to="/devoluciones" className="hover:text-white transition-colors">Devoluciones</Link></li>
                            <li><Link to="/guia-talles" className="hover:text-white transition-colors">Guía de Talles</Link></li>
                            <li><Link to="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</Link></li>
                            <li><Link to="/contacto" className="hover:text-white transition-colors">Contacto Oficial</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Separator */}
                <div className="h-px bg-white/5 mb-8"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-white/40">
                    <p>© {new Date().getFullYear()} TIENDA OFICIAL. Todos los derechos reservados.</p>
                    <div className="flex items-center gap-6">
                        <Link to="/terminos" className="hover:text-white transition-colors uppercase tracking-wider">Términos</Link>
                        <Link to="/privacidad" className="hover:text-white transition-colors uppercase tracking-wider">Privacidad</Link>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
