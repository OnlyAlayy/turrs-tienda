import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import Swal from 'sweetalert2';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { createOrder, loading } = useOrder();

  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Argentina'
    },
    paymentMethod: 'mercadopago',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: ''
  });

  const [errors, setErrors] = useState({});

  // Si no está logueado, avisar y redirigir
  if (!isAuthenticated) {
    Swal.fire({
      icon: 'warning',
      title: 'Inicia sesión',
      text: 'Debes iniciar sesión para realizar una compra'
    });
    navigate('/');
    return null;
  }

  // Si carrito vacío, redirigir al carrito
  if (!cartItems || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const validateForm = () => {
    const newErrors = {};

    // Validar dirección de envío
    if (!formData.shippingAddress.street || !formData.shippingAddress.street.trim()) newErrors.street = 'La calle es requerida';
    if (!formData.shippingAddress.city || !formData.shippingAddress.city.trim()) newErrors.city = 'La ciudad es requerida';
    if (!formData.shippingAddress.state || !formData.shippingAddress.state.trim()) newErrors.state = 'La provincia es requerida';
    if (!formData.shippingAddress.zipCode || !formData.shippingAddress.zipCode.trim()) newErrors.zipCode = 'El código postal es requerido';

    // Validar datos de tarjeta si se selecciona Stripe (tarjeta directa)
    if (formData.paymentMethod === 'stripe') {
      if (!formData.cardNumber) newErrors.cardNumber = 'El número de tarjeta es requerido';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'La fecha de vencimiento es requerida';
      if (!formData.cardCVC) newErrors.cardCVC = 'El CVC es requerido';
      if (!formData.cardName) newErrors.cardName = 'El nombre en la tarjeta es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const orderData = {
        products: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        total: getCartTotal(),
        paymentMethod: formData.paymentMethod,
        shippingAddress: formData.shippingAddress
      };

      const result = await createOrder(orderData);

      if (!result || !result.success) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result?.message || 'No se pudo crear la orden'
        });
        return;
      }

      // Si es MercadoPago: crear preferencia en el backend y redirigir al checkout
      if (formData.paymentMethod === 'mercadopago') {
        const token = localStorage.getItem('token') || '';
        const preferenceResponse = await axios.post(
          `${API_URL}/api/payments/create-preference`,
          {
            items: cartItems,
            orderId: result.order._id
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        // Buscar init_point en distintos posibles lugares (backend puede devolver init_point o sandbox_init_point)
        const data = preferenceResponse.data || {};
        const initPoint =
          data.sandbox_init_point ||
          data.init_point ||
          data.body?.sandbox_init_point ||
          data.body?.init_point ||
          data.checkout?.init_point;

        if (!initPoint) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la URL de redirección de Mercado Pago'
          });
          return;
        }

        // Redirigir al checkout de MercadoPago
        window.location.href = initPoint;
        return;
      }

      // Si es PayPal (placeholder, puedes implementar llamada a backend para generar checkout)
      if (formData.paymentMethod === 'paypal') {
        Swal.fire({
          icon: 'info',
          title: 'Redirección a PayPal',
          text: 'Implementación de PayPal pendiente.'
        });
        return;
      }

      // Si es Stripe (o cualquier otro método que procese en tu sitio):
      // Limpiamos carrito y mostramos confirmación local
      clearCart();
      navigate(`/order-confirmation/${result.order._id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Ocurrió un error al procesar tu orden'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Soporta nombres con punto para campos anidados ("shippingAddress.street")
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));

      // Limpiar error específico del campo anidado (ej: 'street', 'city', etc.)
      if (errors[child]) {
        setErrors(prev => ({ ...prev, [child]: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Limpiar error si existe
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="font-turrs-title text-3xl text-turrs-blue mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección de Envío */}
            <div className="card-turrs">
              <h2 className="font-turrs-text font-semibold text-xl mb-4">Información de Envío</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                    Calle y número *
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.street"
                    value={formData.shippingAddress.street}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue ${
                      errors.street ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>

                <div>
                  <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.city"
                    value={formData.shippingAddress.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                    Provincia *
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.state"
                    value={formData.shippingAddress.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.zipCode"
                    value={formData.shippingAddress.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue ${
                      errors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                </div>

                <div>
                  <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <select
                    name="shippingAddress.country"
                    value={formData.shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue"
                  >
                    <option value="Argentina">Argentina</option>
                    <option value="Chile">Chile</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Bolivia">Bolivia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección de Pago */}
            <div className="card-turrs">
              <h2 className="font-turrs-text font-semibold text-xl mb-4">Método de Pago</h2>
              
              <div className="mb-4">
                <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-2">
                  Selecciona método de pago *
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label
                    className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                      formData.paymentMethod === 'mercadopago' 
                        ? 'border-turrs-blue bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercadopago"
                      checked={formData.paymentMethod === 'mercadopago'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="font-turrs-text font-semibold">Mercado Pago</div>
                  </label>

                  <label
                    className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                      formData.paymentMethod === 'paypal' 
                        ? 'border-turrs-blue bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="font-turrs-text font-semibold">PayPal</div>
                  </label>

                  <label
                    className={`border-2 rounded-lg p-4 cursor-pointer text-center ${
                      formData.paymentMethod === 'stripe' 
                        ? 'border-turrs-blue bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={formData.paymentMethod === 'stripe'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="font-turrs-text font-semibold">Tarjeta</div>
                  </label>
                </div>
              </div>

              {/* Campos de tarjeta (solo para stripe) */}
              {formData.paymentMethod === 'stripe' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                      Nombre en la tarjeta *
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue ${
                        errors.cardName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Juan Pérez"
                    />
                    {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                  </div>

                  <div>
                    <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                      Número de tarjeta *
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                        Vencimiento *
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue ${
                          errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="MM/AA"
                      />
                      {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
                    </div>

                    <div>
                      <label className="block font-turrs-text text-sm font-medium text-gray-700 mb-1">
                        CVC *
                      </label>
                      <input
                        type="text"
                        name="cardCVC"
                        value={formData.cardCVC}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-turrs-blue ${
                          errors.cardCVC ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123"
                      />
                      {errors.cardCVC && <p className="text-red-500 text-sm mt-1">{errors.cardCVC}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Información para otros métodos de pago */}
              {formData.paymentMethod !== 'stripe' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-turrs-text text-sm text-blue-800">
                    {formData.paymentMethod === 'mercadopago' 
                      ? 'Serás redirigido a Mercado Pago para completar el pago de forma segura.'
                      : 'Serás redirigido a PayPal para completar el pago de forma segura.'
                    }
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-turrs-red py-3 text-lg disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Realizar Pedido'}
            </button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div>
          <div className="card-turrs sticky top-4">
            <h2 className="font-turrs-text font-semibold text-xl mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-turrs-text font-semibold">{item.name}</p>
                    <p className="font-turrs-text text-sm text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-turrs-text font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-turrs-text">Subtotal:</span>
                <span className="font-turrs-text">${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-turrs-text">Envío:</span>
                <span className="font-turrs-text">Gratis</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span className="text-turrs-blue">${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
