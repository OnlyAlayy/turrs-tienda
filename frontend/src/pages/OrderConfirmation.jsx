import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { getOrder } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // If we wanted, we could also verify the session_id with backend here
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error accediendo al pedido',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#74ACDF]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col justify-center items-center p-6 text-center">
        <h2 className="text-2xl text-white/60 mb-8">Orden no encontrada</h2>
        <Link
          to="/tienda"
          className="h-12 px-8 rounded-full font-bold tracking-widest text-sm uppercase bg-white text-black hover:bg-[#74ACDF] transition-colors flex items-center justify-center"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#74ACDF]/30 pt-32 pb-24 px-6 lg:px-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >

        {/* Success Icon */}
        <div className="mb-10 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-[#74ACDF]/10 rounded-full flex items-center justify-center border border-[#74ACDF]/30 shadow-[0_0_50px_rgba(116,172,223,0.2)]">
              <svg className="w-10 h-10 text-[#74ACDF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">
            ¡Pago Confirmado!
          </h1>
          <p className="text-white/60 text-lg">
            Gracias por tu compra. Tu pedido <span className="text-white font-medium">#{order._id.slice(-8).toUpperCase()}</span> está siendo procesado.
          </p>
        </div>

        <div className="bg-[#0A0A0C] border border-white/5 p-8 md:p-10 rounded-3xl mb-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-white/5 text-sm">
            <div>
              <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Fecha</p>
              <p className="text-white font-medium">{new Date(order.createdAt).toLocaleDateString('es-ES')}</p>
            </div>
            <div>
              <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Método de Pago</p>
              <p className="text-white font-medium capitalize">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Estado</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#74ACDF]/10 text-[#74ACDF] border border-[#74ACDF]/20">
                Aprobado
              </span>
            </div>
            <div>
              <p className="text-white/40 uppercase tracking-widest text-[10px] font-bold mb-2">Total</p>
              <p className="text-[#C9A84C] font-bold">{formatPrice(order.total)}</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#C9A84C] rounded-full"></span>
              Resumen de Productos
            </h3>
            <div className="space-y-4">
              {order.products.map((item, index) => (
                <div key={index} className="flex gap-4 items-center p-4 rounded-2xl bg-black/30 border border-white/5">
                  <div className="w-16 h-16 rounded-xl bg-[#050505] overflow-hidden shrink-0 border border-white/5">
                    {item.productId.images && item.productId.images[0] ? (
                      <img src={item.productId.images[0]} alt={item.productId.name} className="w-full h-full object-cover mix-blend-lighten" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">Sin Foto</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">{item.productId.name}</p>
                    <p className="text-white/40 text-xs">Cant: {item.quantity} × {formatPrice(item.price)}</p>
                  </div>
                  <div className="text-white font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-white/20 rounded-full"></span>
              Envío a
            </h3>
            <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-white/60 text-sm leading-relaxed">
              <p className="text-white font-medium mb-1">{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            to="/tienda"
            className="h-14 px-8 rounded-full font-bold tracking-widest text-sm uppercase bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center"
          >
            Seguir Comprando
          </Link>
          <Link
            to="/"
            className="h-14 px-8 rounded-full font-bold tracking-widest text-sm uppercase bg-white text-black hover:bg-[#74ACDF] hover:scale-105 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(116,172,223,0.3)]"
          >
            Volver al Inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderConfirmation;