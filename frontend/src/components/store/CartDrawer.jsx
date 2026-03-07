import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartDrawer = () => {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout'); // Direct to standard checkout for now (Phase 9 will be Stripe)
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0A0A0C] border-l border-white/10 shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                Mi Carrito <span className="text-white/40 text-sm font-normal">({cartItems.length})</span>
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            >
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white/20" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight">Tu carrito está vacío</h3>
                                    <p className="text-white/50 text-sm mb-8">Parece que aún no has agregado ningún producto.</p>
                                    <button
                                        onClick={() => { setIsCartOpen(false); navigate('/tienda'); }}
                                        className="text-[#74ACDF] font-medium hover:text-white transition-colors text-sm uppercase tracking-widest border-b border-[#74ACDF]/30 pb-1"
                                    >
                                        Explorar Tienda
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {cartItems.map((item, index) => (
                                        <div key={item.size ? `${item._id}-${item.size}` : `${item._id}-${index}`} className="flex gap-4">
                                            {/* Image */}
                                            <div className="w-24 h-32 rounded-xl bg-[#050505] border border-white/5 overflow-hidden shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-lighten" />
                                            </div>

                                            {/* Details */}
                                            <div className="flex flex-col justify-between py-1 flex-1">
                                                <div>
                                                    <div className="flex justify-between items-start gap-4 mb-1">
                                                        <h4 className="text-white font-medium text-sm leading-tight line-clamp-2">{item.name}</h4>
                                                        <button
                                                            onClick={() => removeFromCart(item._id, item.size)}
                                                            className="text-white/30 hover:text-red-400 transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
                                                        >
                                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </div>
                                                    <p className="text-white/40 text-xs capitalize">{item.brand} {item.size && `· ${item.size}`}</p>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    {/* Qty selector mobile optimized 44px min */}
                                                    <div className="flex items-center border border-white/10 rounded-full h-11 px-1 bg-[#050505]">
                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)}
                                                            className="w-11 h-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                                                        >
                                                            <svg width="10" height="2" viewBox="0 0 14 2" fill="currentColor"><rect width="14" height="2" rx="1" /></svg>
                                                        </button>
                                                        <span className="text-white text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                                                            className="w-11 h-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                                                        >
                                                            <svg width="10" height="10" viewBox="0 0 14 14" fill="currentColor"><path d="M8 0H6v6H0v2h6v6h2V8h6V6H8V0z" /></svg>
                                                        </button>
                                                    </div>

                                                    <div className="text-white font-bold text-sm">
                                                        {formatPrice(item.price)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="border-t border-white/10 p-6 bg-[#050505] shrink-0">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-white/60 font-medium">Subtotal</span>
                                    <span className="text-2xl text-white font-bold tracking-tight">{formatPrice(getCartTotal())}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full h-14 bg-white text-black font-bold tracking-widest uppercase rounded-full hover:bg-[#74ACDF] transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(116,172,223,0.3)]"
                                >
                                    Ir al Checkout
                                </button>
                                <p className="text-white/30 text-[10px] text-center mt-4">
                                    Envío y cargos aplicados en el siguiente paso.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
