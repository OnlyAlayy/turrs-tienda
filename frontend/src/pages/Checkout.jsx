import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import { motion } from 'framer-motion';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { createOrder, loading: orderLoading } = useOrder();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Argentina'
    },
    paymentMethod: 'stripe'
  });

  const [errors, setErrors] = useState({});

  if (!isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para realizar una compra',
      color: '#ffffff',
      background: '#0a0a0c',
      confirmButtonColor: '#74ACDF'
    });
    navigate('/login'); // Assuming /login exists
    return null;
  }

  if (!cartItems || cartItems.length === 0) {
    navigate('/tienda');
    return null;
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shippingAddress.street.trim()) newErrors.street = 'La calle es requerida';
    if (!formData.shippingAddress.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.shippingAddress.state.trim()) newErrors.state = 'La provincia es requerida';
    if (!formData.shippingAddress.zipCode.trim()) newErrors.zipCode = 'El código postal es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const orderData = {
        products: cartItems.map(item => ({
          productId: item._id || item.id,
          size: item.size || 'Única',
          quantity: item.quantity,
          price: item.price
        })),
        total: getCartTotal(),
        paymentMethod: formData.paymentMethod,
        shippingAddress: formData.shippingAddress
      };

      const result = await createOrder(orderData);

      if (!result || !result.success) {
        throw new Error(result?.message || 'No se pudo crear la orden en nuestra base de datos');
      }

      const orderId = result.order._id;
      const token = localStorage.getItem('token') || '';

      if (formData.paymentMethod === 'stripe') {
        const stripeRes = await axios.post(`${API_URL}/api/stripe/create-checkout-session`, {
          items: cartItems,
          orderId
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (stripeRes.data.url) {
          clearCart(); // Can clear after they leave
          window.location.href = stripeRes.data.url;
          return;
        } else {
          throw new Error('Fallo al inicializar Stripe Checkout');
        }
      }

      if (formData.paymentMethod === 'mercadopago') {
        const mpRes = await axios.post(`${API_URL}/api/payments/create-preference`, {
          items: cartItems,
          orderId
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const initPoint = mpRes.data?.sandbox_init_point || mpRes.data?.init_point;
        if (initPoint) {
          clearCart();
          window.location.href = initPoint;
          return;
        } else {
          throw new Error('Fallo al inicializar Mercado Pago');
        }
      }

    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error procesando el pago',
        text: error.response?.data?.message || error.message || 'Ocurrió un error inesperado',
        color: '#ffffff',
        background: '#0a0a0c',
        confirmButtonColor: '#74ACDF'
      });
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
      if (errors[child]) setErrors(prev => ({ ...prev, [child]: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const disableSubmit = isProcessing || orderLoading;

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#74ACDF]/30 pt-32 pb-24 px-6 lg:px-12 max-w-[1400px] mx-auto">

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-4">Checkout</h1>
        <p className="text-white/60">Completa tus datos para finalizar la compra.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

        {/* Left: Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* Shipping Info */}
            <div className="bg-[#0A0A0C] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-sm flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
                Dirección de Envío
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Calle y Número</label>
                  <input
                    type="text"
                    name="shippingAddress.street"
                    value={formData.shippingAddress.street}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 border ${errors.street ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF] transition-colors`}
                    placeholder="Ej. Av. Siempre Viva 742"
                  />
                  {errors.street && <p className="text-red-400 text-xs mt-2">{errors.street}</p>}
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Ciudad</label>
                  <input
                    type="text"
                    name="shippingAddress.city"
                    value={formData.shippingAddress.city}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 border ${errors.city ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF] transition-colors`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-2">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Provincia</label>
                  <input
                    type="text"
                    name="shippingAddress.state"
                    value={formData.shippingAddress.state}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 border ${errors.state ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF] transition-colors`}
                  />
                  {errors.state && <p className="text-red-400 text-xs mt-2">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2">Código Postal</label>
                  <input
                    type="text"
                    name="shippingAddress.zipCode"
                    value={formData.shippingAddress.zipCode}
                    onChange={handleInputChange}
                    className={`w-full bg-black/50 border ${errors.zipCode ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF] transition-colors`}
                  />
                  {errors.zipCode && <p className="text-red-400 text-xs mt-2">{errors.zipCode}</p>}
                </div>

                <div>
                  <label className="block text-white/50 text-xs font-bold uppercase tracking-widest mb-2">País</label>
                  <select
                    name="shippingAddress.country"
                    value={formData.shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#74ACDF] transition-colors appearance-none"
                  >
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Uruguay">Uruguay</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#0A0A0C] border border-white/5 p-8 rounded-3xl">
              <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-sm flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
                Método de Pago
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stripe */}
                <label className={`
                  relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all
                  ${formData.paymentMethod === 'stripe' ? 'border-[#74ACDF] bg-[#74ACDF]/5' : 'border-white/10 hover:border-white/30 bg-black/30'}
                `}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={formData.paymentMethod === 'stripe'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${formData.paymentMethod === 'stripe' ? 'border-[#74ACDF]' : 'border-white/30'}`}>
                    {formData.paymentMethod === 'stripe' && <div className="w-2.5 h-2.5 rounded-full bg-[#74ACDF]" />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Tarjeta de Crédito / Débito</h3>
                    <p className="text-white/40 text-xs mt-1">Pago seguro procesado por Stripe</p>
                  </div>
                </label>

                {/* MercadoPago */}
                <label className={`
                  relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all
                  ${formData.paymentMethod === 'mercadopago' ? 'border-[#74ACDF] bg-[#74ACDF]/5' : 'border-white/10 hover:border-white/30 bg-black/30'}
                `}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mercadopago"
                    checked={formData.paymentMethod === 'mercadopago'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${formData.paymentMethod === 'mercadopago' ? 'border-[#74ACDF]' : 'border-white/30'}`}>
                    {formData.paymentMethod === 'mercadopago' && <div className="w-2.5 h-2.5 rounded-full bg-[#74ACDF]" />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Mercado Pago</h3>
                    <p className="text-white/40 text-xs mt-1">Dinero en cuenta o Tarjetas locales</p>
                  </div>
                </label>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#74ACDF]/5 border border-[#74ACDF]/20">
                <p className="text-[#74ACDF] text-sm flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Serás redirigido a la plataforma elegida para completar tu pago de forma encriptada y segura. No guardamos tus datos financieros.
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={disableSubmit}
              className={`
                w-full h-16 rounded-full font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-3
                ${disableSubmit
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-[#74ACDF] hover:scale-[1.02] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(116,172,223,0.3)]'}
              `}
            >
              {disableSubmit ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Finalizar Pago Seguro'
              )}
            </button>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="lg:w-[400px] shrink-0">
          <div className="bg-[#0A0A0C] border border-white/5 p-8 rounded-3xl sticky top-32">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-sm border-b border-white/10 pb-4">Resumen del Pedido</h2>

            <div className="space-y-4 mb-6">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 h-20 rounded-lg bg-[#050505] border border-white/5 overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-lighten" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-white text-sm font-medium line-clamp-1">{item.name}</h4>
                    <p className="text-white/40 text-xs mt-1 capitalize">{item.brand} {item.size && `· ${item.size}`}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white/60 text-xs">Cant: {item.quantity}</span>
                      <span className="text-white font-bold text-sm">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center text-white/60 text-sm">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between items-center text-white/60 text-sm">
                <span>Costo de Envío</span>
                <span className="text-[#C9A84C]">Gratis</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
              <span className="text-white font-medium">Total Estimado</span>
              <span className="text-2xl text-white font-bold tracking-tight">{formatPrice(getCartTotal())}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
