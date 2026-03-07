import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import AuthModal from '../auth/AuthModal';

// Mock icons
const SearchIcon = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const UserIcon = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const CartIcon = ({ count = 0 }) => (
    <div className="relative">
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        {count > 0 && <span className="absolute -top-2 -right-2 bg-[#74ACDF] text-[#050505] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{count}</span>}
    </div>
);
const MenuIcon = () => <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;

const dropdownVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

const MegaMenuDropdown = ({ children }) => (
    <motion.div
        variants={dropdownVariants}
        initial="hidden" animate="visible" exit="exit"
        className="absolute top-12 left-1/2 -translate-x-1/2 bg-[#0A0A0C] border border-white/5 rounded-2xl shadow-2xl shadow-black/80 p-6 min-w-[280px] z-50 text-left cursor-default"
    >
        {children}
    </motion.div>
);

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/tienda?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const location = useLocation();
    const navigate = useNavigate();
    const isLandingPage = location.pathname === '/' || location.pathname === '/argentina2026';

    const { getCartItemsCount, setIsCartOpen } = useCart();
    const { isAuthenticated, logout, user } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleUserClick = () => {
        if (isAuthenticated) {
            navigate('/mis-pedidos');
        } else {
            setIsAuthModalOpen(true);
        }
    };

    const navClass = `fixed top-0 left-0 right-0 z-50 h-14 transition-colors duration-300 flex items-center justify-between px-6 lg:px-12 ${isLandingPage && !isScrolled
        ? 'bg-transparent text-white'
        : 'bg-black/85 backdrop-blur-md border-b border-white/5'
        }`;

    return (
        <>
            <nav className={navClass}>
                {/* LEFT - Logo + Brand */}
                <Link to="/" className="flex flex-col justify-center">
                    <span className="text-white font-bold tracking-tight text-xl flex items-center gap-1">
                        TURRS
                    </span>
                    <span className="text-white/30 text-[10px] tracking-widest hidden sm:block uppercase mt-0.5">
                        Argentina · Adidas · Nike · Perfumes
                    </span>
                </Link>

                {/* CENTER - Mega-menu (Desktop) */}
                <div className="hidden lg:flex items-center gap-8 h-full">
                    <Link to="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Inicio</Link>

                    {/* Camisetas */}
                    <div
                        className="relative h-full flex items-center group cursor-pointer"
                        onMouseEnter={() => setActiveDropdown('camisetas')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            Camisetas
                        </span>
                        <AnimatePresence>
                            {activeDropdown === 'camisetas' && (
                                <MegaMenuDropdown>
                                    <div className="flex flex-col gap-3">
                                        <Link to="/tienda/camiseta-argentina-2026-titular" className="text-white/70 hover:text-white text-sm transition-colors">Argentina 2026 Titular</Link>
                                        <Link to="/tienda/camiseta-argentina-2026-alternativa" className="text-white/70 hover:text-white text-sm transition-colors">Argentina 2026 Alternativa</Link>
                                        <Link to="/coleccion/afa" className="text-white/70 hover:text-white text-sm transition-colors">Colección Retro</Link>
                                        <Link to="/tienda?category=camisetas" className="text-[#74ACDF] hover:text-white text-sm font-medium mt-2 transition-colors">Ver todas &rarr;</Link>
                                    </div>
                                </MegaMenuDropdown>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Ropa Deportiva */}
                    <div
                        className="relative h-full flex items-center group cursor-pointer"
                        onMouseEnter={() => setActiveDropdown('ropa')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            Ropa Deportiva
                        </span>
                        <AnimatePresence>
                            {activeDropdown === 'ropa' && (
                                <MegaMenuDropdown>
                                    <div className="flex flex-col gap-3">
                                        <Link to="/coleccion/adidas" className="text-white/70 hover:text-white text-sm transition-colors">Colección Adidas</Link>
                                        <Link to="/coleccion/nike" className="text-white/70 hover:text-white text-sm transition-colors">Colección Nike</Link>
                                        <div className="h-px bg-white/10 my-1" />
                                        <Link to="/tienda?category=ropa-deportiva&subcategory=buzos" className="text-white/70 hover:text-white text-sm transition-colors">Buzos y Camperas</Link>
                                        <Link to="/tienda?category=ropa-deportiva&subcategory=shorts" className="text-white/70 hover:text-white text-sm transition-colors">Shorts y Remeras</Link>
                                        <Link to="/tienda?category=ropa-deportiva" className="text-[#74ACDF] hover:text-white text-sm font-medium mt-2 transition-colors">Ver todo &rarr;</Link>
                                    </div>
                                </MegaMenuDropdown>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Calzado */}
                    <div
                        className="relative h-full flex items-center group cursor-pointer"
                        onMouseEnter={() => setActiveDropdown('calzado')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            Calzado
                        </span>
                        <AnimatePresence>
                            {activeDropdown === 'calzado' && (
                                <MegaMenuDropdown>
                                    <div className="flex flex-col gap-3">
                                        <Link to="/tienda?category=calzado&subcategory=futbol" className="text-white/70 hover:text-white text-sm transition-colors">Fútbol</Link>
                                        <Link to="/tienda?category=calzado&subcategory=running" className="text-white/70 hover:text-white text-sm transition-colors">Running</Link>
                                        <Link to="/tienda?category=calzado&subcategory=lifestyle" className="text-white/70 hover:text-white text-sm transition-colors">Lifestyle</Link>
                                        <Link to="/tienda?category=calzado" className="text-[#74ACDF] hover:text-white text-sm font-medium mt-2 transition-colors">Ver todo &rarr;</Link>
                                    </div>
                                </MegaMenuDropdown>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Perfumes */}
                    <div
                        className="relative h-full flex items-center group cursor-pointer"
                        onMouseEnter={() => setActiveDropdown('perfumes')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                            Perfumes
                        </span>
                        <AnimatePresence>
                            {activeDropdown === 'perfumes' && (
                                <MegaMenuDropdown>
                                    <div className="flex flex-col gap-3">
                                        <Link to="/tienda?category=perfumes&gender=masculino" className="text-white/70 hover:text-white text-sm transition-colors">Masculinos</Link>
                                        <Link to="/tienda?category=perfumes&gender=femenino" className="text-white/70 hover:text-white text-sm transition-colors">Femeninos</Link>
                                        <div className="h-px bg-white/10 my-1" />
                                        <Link to="/coleccion/perfumes" className="text-white/50 text-xs tracking-wider uppercase mb-1">Marcas</Link>
                                        <Link to="/coleccion/adidas" className="text-white/70 hover:text-white text-sm transition-colors">Adidas · Nike · Lacoste</Link>
                                        <Link to="/coleccion/carolina-herrera" className="text-white/70 hover:text-white text-sm transition-colors">Ralph Lauren · Carolina Herrera</Link>
                                        <Link to="/coleccion/perfumes" className="text-[#C9A84C] hover:text-white text-sm font-medium mt-2 transition-colors">Ver todos &rarr;</Link>
                                    </div>
                                </MegaMenuDropdown>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Accesorios */}
                    <Link to="/tienda?category=accesorios" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                        Accesorios
                    </Link>
                </div>

                {/* RIGHT - Actions */}
                <div className="flex items-center gap-4 lg:gap-6">
                    <div className="relative flex items-center">
                        <AnimatePresence>
                            {isSearchOpen && (
                                <motion.form
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 160, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    onSubmit={handleSearchSubmit}
                                    className="overflow-hidden mr-2 hidden sm:block"
                                >
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar..."
                                        autoFocus
                                        className="w-full bg-transparent border-b border-white/30 text-white text-sm py-1 focus:outline-none focus:border-white placeholder:text-white/30"
                                        onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                    />
                                </motion.form>
                            )}
                        </AnimatePresence>
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                        >
                            <SearchIcon />
                        </button>
                    </div>

                    {/* User Profile / Auth */}
                    <div
                        className="relative hidden sm:flex items-center h-full group"
                        onMouseEnter={() => setActiveDropdown('user')}
                        onMouseLeave={() => setActiveDropdown(null)}
                    >
                        <button onClick={handleUserClick} className="text-white/70 group-hover:text-white transition-colors h-full flex items-center">
                            <UserIcon />
                        </button>
                        <AnimatePresence>
                            {activeDropdown === 'user' && isAuthenticated && (
                                <motion.div
                                    variants={dropdownVariants}
                                    initial="hidden" animate="visible" exit="exit"
                                    className="absolute top-10 right-0 bg-[#0A0A0C] border border-white/5 rounded-2xl shadow-2xl shadow-black/80 p-4 min-w-[200px] z-50 text-left cursor-default"
                                >
                                    <div className="flex flex-col gap-3">
                                        <Link to="/perfil" className="text-white/70 hover:text-white text-sm transition-colors block">Mi Perfil</Link>
                                        <Link to="/mis-pedidos" className="text-white/70 hover:text-white text-sm transition-colors block">Mis Pedidos</Link>
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" className="text-[#C9A84C] font-semibold hover:text-white text-sm transition-colors block">
                                                Panel de Admin
                                            </Link>
                                        )}
                                        <div className="h-px bg-white/10 my-1" />
                                        <button
                                            onClick={() => { logout(); navigate('/'); }}
                                            className="text-[#C9A84C] hover:text-white text-sm text-left transition-colors font-medium"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="text-white/70 hover:text-white transition-colors"
                    >
                        <CartIcon count={getCartItemsCount()} />
                    </button>

                    {/* Mobile menu button */}
                    <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-white/70 hover:text-white transition-colors">
                        <MenuIcon />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-[#0A0A0C] border-l border-white/5 z-[70] p-6 flex flex-col lg:hidden overflow-y-auto"
                        >
                            <div className="flex justify-end mb-8">
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white">
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex flex-col gap-6 flex-1">
                                <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileMenuOpen(false); }} className="relative mb-4">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Buscar productos..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#74ACDF]"
                                    />
                                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                                        <SearchIcon />
                                    </button>
                                </form>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#74ACDF]">Explorar</h4>
                                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/tienda" className="block text-xl font-medium text-white/80 hover:text-white">Toda la Tienda</Link>
                                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/tienda/camiseta-argentina-2026-titular" className="block text-xl font-medium text-white/80 hover:text-white">Argentina 2026</Link>
                                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/coleccion/adidas" className="block text-xl font-medium text-white/80 hover:text-white">Adidas</Link>
                                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/coleccion/nike" className="block text-xl font-medium text-white/80 hover:text-white">Nike</Link>
                                </div>

                                <div className="space-y-4 mt-4">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-[#C9A84C]">Perfumería</h4>
                                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/tienda?category=perfumes&gender=masculino" className="block text-xl font-medium text-white/80 hover:text-white">Masculinos</Link>
                                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/tienda?category=perfumes&gender=femenino" className="block text-xl font-medium text-white/80 hover:text-white">Femeninos</Link>
                                    <Link onClick={() => setIsMobileMenuOpen(false)} to="/coleccion/perfumes" className="block text-xl font-medium text-white/80 hover:text-white">Marcas Top</Link>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                {isAuthenticated ? (
                                    <div className="flex flex-col gap-4">
                                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/perfil" className="flex items-center gap-3 text-white/80">
                                            <UserIcon /> Mi Perfil
                                        </Link>
                                        <Link onClick={() => setIsMobileMenuOpen(false)} to="/mis-pedidos" className="flex items-center gap-3 text-white/80">
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> Mis Pedidos
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin" className="flex items-center gap-3 text-[#C9A84C] font-semibold">
                                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> Panel de Admin
                                            </Link>
                                        )}
                                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate('/'); }} className="flex items-center gap-3 text-[#C9A84C] text-left">
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="w-full bg-white text-black font-bold py-3 rounded-xl uppercase tracking-widest text-sm">
                                        Iniciar Sesión
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default Navbar;
