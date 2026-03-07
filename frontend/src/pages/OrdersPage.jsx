import React, { useState, useEffect } from 'react';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const OrdersPage = () => {
    const { getUserOrders } = useOrder();
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!isAuthenticated) return <Navigate to="/" replace />;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getUserOrders();
            setOrders(data);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error accediendo al historial',
                text: error.message,
                color: '#ffffff',
                background: '#0a0a0c',
                confirmButtonColor: '#74ACDF'
            });
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'paid': return { bg: 'bg-[#74ACDF]/10', text: 'text-[#74ACDF]', border: 'border-[#74ACDF]/20', label: 'Pagado' };
            case 'pending': return { bg: 'bg-[#C9A84C]/10', text: 'text-[#C9A84C]', border: 'border-[#C9A84C]/20', label: 'Pendiente' };
            case 'cancelled': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Cancelado' };
            case 'shipped': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Enviado' };
            case 'delivered': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', label: 'Entregado' };
            default: return { bg: 'bg-white/5', text: 'text-white/60', border: 'border-white/10', label: status };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74ACDF]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#74ACDF]/30 pt-32 pb-24 px-6 lg:px-12 max-w-[1200px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">Mis Pedidos</h1>
                    <p className="text-white/60">Revisa el historial y estado de tus compras.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-[#0A0A0C] border border-white/5 p-12 rounded-3xl text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl text-white font-medium mb-4">No tienes pedidos aún</h2>
                        <Link
                            to="/tienda"
                            className="inline-flex h-12 px-8 rounded-full font-bold tracking-widest text-sm uppercase bg-white text-black hover:bg-[#74ACDF] hover:scale-105 transition-all items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(116,172,223,0.3)]"
                        >
                            Explorar Tienda
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = getStatusConfig(order.status);
                            return (
                                <div key={order._id} className="bg-[#0A0A0C] border border-white/5 p-6 md:p-8 rounded-3xl hover:border-white/10 transition-colors">

                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                                        <div>
                                            <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-1">Orden #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-white font-medium text-sm">{new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${status.bg} ${status.text} ${status.border}`}>
                                                {status.label}
                                            </span>
                                            <p className="text-[#C9A84C] font-bold text-lg">{formatPrice(order.total)}</p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-4">
                                        {order.products.map((item, idx) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 rounded-xl bg-[#050505] overflow-hidden shrink-0 border border-white/5">
                                                    {item.productId?.images?.[0] ? (
                                                        <img src={item.productId.images[0]} alt={item.productId.name} className="w-full h-full object-cover mix-blend-lighten" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/20 text-xs text-center">No img</div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <Link to={`/producto/${item.productId?._id}`} className="text-white hover:text-[#74ACDF] font-medium text-sm transition-colors decoration-transparent hover:underline line-clamp-1">
                                                        {item.productId?.name || 'Producto no disponible'}
                                                    </Link>
                                                    <p className="text-white/40 text-[11px] mt-1">Cant: {item.quantity} × {formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                        <Link
                                            to={`/order-confirmation/${order._id}`}
                                            className="text-xs font-bold tracking-widest uppercase text-white hover:text-[#74ACDF] transition-colors flex items-center gap-2"
                                        >
                                            Ver Detalle
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default OrdersPage;
