import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';

// Status badge colors map
export const STATUS_STYLES = {
    pending: { bg: 'bg-white/10', text: 'text-white/50', label: '⏳ Pendiente' },
    paid: { bg: 'bg-[#74ACDF]/20', text: 'text-[#74ACDF]', label: '✅ Pagado' },
    processing: { bg: 'bg-yellow-400/20', text: 'text-yellow-400', label: '⚙️ Procesando' },
    shipped: { bg: 'bg-blue-400/20', text: 'text-blue-400', label: '🚚 En camino' },
    delivered: { bg: 'bg-green-400/20', text: 'text-green-400', label: '📦 Entregado' },
    cancelled: { bg: 'bg-red-400/20', text: 'text-red-400', label: '❌ Cancelado' }
};

export const formatPrice = (price) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);

export const formatDate = (dateString) => {
    const d = new Date(dateString);
    return {
        date: d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + 'hs'
    };
};

const OrderDetailModal = ({ isOpen, onClose, order, onOrderUpdate }) => {
    if (!isOpen || !order) return null;

    const [status, setStatus] = useState(order.status);
    const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async () => {
        try {
            setIsUpdating(true);
            const token = localStorage.getItem('token');

            const payload = { status };
            if (status === 'shipped' && trackingNumber.trim()) {
                payload.trackingNumber = trackingNumber.trim();
            }

            const response = await axios.patch(
                `http://localhost:5000/api/orders/${order._id}/status`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            onOrderUpdate(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#0a0a0c',
                color: '#fff'
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo actualizar el estado de la orden', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    const user = order.userId || {};
    const { date, time } = formatDate(order.createdAt);
    const badge = STATUS_STYLES[order.status] || STATUS_STYLES.pending;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#0A0A0C] border border-white/10 rounded-3xl w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto p-6 md:p-8 relative"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-white">Orden #{order._id.slice(-8).toUpperCase()}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                    {badge.label}
                                </span>
                            </div>
                            <p className="text-white/40 text-sm">
                                {date} a las {time}
                            </p>
                            {order.stripeSessionId && (
                                <p className="text-white/20 text-xs font-mono mt-1 cursor-pointer hover:text-white/40 transition">
                                    Session: {order.stripeSessionId}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition"
                        >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Cliente */}
                    <div className="mb-6">
                        <h3 className="text-[#74ACDF] text-xs tracking-[0.3em] uppercase mb-3 font-semibold">Cliente</h3>
                        <div className="bg-[#050505] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white/50 font-medium">
                                        {(user.firstName?.[0] || user.name?.[0] || user.email?.[0] || '?').toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium">
                                    {user.firstName ? `${user.firstName} ${user.lastName}` : (user.name || 'Usuario desconocido')}
                                </p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs">
                                    <span className="text-white/50">{user.email}</span>
                                    {(user.dni || order.shippingAddress?.dni) && (
                                        <span className="text-white/30">DNI: {user.dni || order.shippingAddress?.dni}</span>
                                    )}
                                    {(user.phone || order.shippingAddress?.phone) && (
                                        <span className="text-white/30">Tel: {user.phone || order.shippingAddress?.phone}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dirección de envío */}
                    {order.shippingAddress && (
                        <div className="mb-6">
                            <h3 className="text-[#74ACDF] text-xs tracking-[0.3em] uppercase mb-3 font-semibold">Dirección de Envío</h3>
                            <div className="bg-[#050505] rounded-2xl p-4 border border-white/5 text-sm">
                                <p className="text-white/80 font-medium mb-1">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p className="text-white/60">
                                    {order.shippingAddress.street} {order.shippingAddress.streetNumber}
                                    {order.shippingAddress.floor && ` Piso ${order.shippingAddress.floor}`}
                                    {order.shippingAddress.apartment && ` Dpto ${order.shippingAddress.apartment}`}
                                </p>
                                <p className="text-white/40">
                                    {order.shippingAddress.city}, {order.shippingAddress.province} - CP {order.shippingAddress.postalCode}
                                </p>
                                {order.shippingAddress.phone && (
                                    <p className="text-white/40 mt-1">Tel: {order.shippingAddress.phone}</p>
                                )}
                                {order.shippingAddress.dni && (
                                    <p className="text-white/30">DNI: {order.shippingAddress.dni}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Productos */}
                    <div className="mb-6">
                        <h3 className="text-[#74ACDF] text-xs tracking-[0.3em] uppercase mb-3 font-semibold">Productos</h3>
                        <div className="bg-[#050505] rounded-2xl p-4 border border-white/5">
                            <div className="divide-y divide-white/5">
                                {order.products.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                                        <div className="w-14 h-14 rounded-xl bg-black overflow-hidden shrink-0 border border-white/5">
                                            {item.productId?.images?.[0] ? (
                                                <img src={item.productId.images[0]} alt="Producto" className="w-full h-full object-cover mix-blend-lighten" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Sin img</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white/80 text-sm font-medium line-clamp-1">{item.productId?.name || 'Producto eliminado'}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <div className="text-xs">
                                                    <span className="text-white/40">{item.size && item.size !== 'Única' ? `Talle: ${item.size} | ` : ''}</span>
                                                    <span className="text-white/30">x{item.quantity}</span>
                                                </div>
                                                <span className="text-white/60 text-sm">{formatPrice(item.price)}</span>
                                            </div>
                                        </div>
                                        <div className="text-white font-medium text-right min-w-[80px]">
                                            {formatPrice(item.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 text-sm">
                                <div className="flex justify-between text-white/50">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/50">Envío</span>
                                    <span className="text-green-400">Gratis</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-white mt-2 pt-2 border-t border-white/5">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gestión del Pedido */}
                    <div className="mb-6">
                        <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3 font-semibold">Gestión del Pedido</h3>
                        <div className="bg-[#050505] rounded-2xl p-4 border border-white/5">
                            <label className="block text-white/60 text-sm mb-2">Cambiar estado del pedido:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF] mb-4 appearance-none"
                            >
                                <option value="pending">⏳ Pendiente</option>
                                <option value="paid">✅ Pagado</option>
                                <option value="processing">⚙️ Procesando</option>
                                <option value="shipped">🚚 En camino</option>
                                <option value="delivered">📦 Entregado</option>
                                <option value="cancelled">❌ Cancelado</option>
                            </select>

                            <AnimatePresence>
                                {status === 'shipped' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mb-4"
                                    >
                                        <label className="block text-white/60 text-sm mb-2">Número de seguimiento</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: AR123456789"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            className="w-full bg-[#0A0A0C] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#74ACDF]"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={handleUpdateStatus}
                                disabled={isUpdating || (status === order.status && trackingNumber === (order.trackingNumber || ''))}
                                className="w-full bg-gradient-to-r from-[#74ACDF] to-[#C9A84C] text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(116,172,223,0.3)]"
                            >
                                {isUpdating ? 'Actualizando...' : 'Actualizar estado'}
                            </button>
                        </div>
                    </div>

                    {/* Close Button Bottom */}
                    <button
                        onClick={onClose}
                        className="w-full text-white/40 hover:text-white transition py-3 text-sm font-medium"
                    >
                        Cerrar Detalles
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OrderDetailModal;
