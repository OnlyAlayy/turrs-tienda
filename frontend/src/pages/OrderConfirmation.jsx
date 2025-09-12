import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import Swal from 'sweetalert2';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrder } = useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const orderData = await getOrder(orderId);
      setOrder(orderData);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-turrs-blue"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h2 className="font-turrs-text text-2xl text-gray-600">Orden no encontrada</h2>
        <Link to="/" className="btn-turrs mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icono de éxito */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="font-turrs-title text-3xl text-turrs-blue mb-4">
          ¡Pedido Confirmado!
        </h1>

        <p className="font-turrs-text text-gray-600 mb-8">
          Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
        </p>

        {/* Información de la orden */}
        <div className="card-turrs text-left mb-8">
          <h2 className="font-turrs-text font-semibold text-xl mb-4">Detalles del Pedido</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-turrs-text text-sm text-gray-600">Número de orden:</p>
              <p className="font-turrs-text font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div>
              <p className="font-turrs-text text-sm text-gray-600">Fecha:</p>
              <p className="font-turrs-text font-semibold">
                {new Date(order.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div>
              <p className="font-turrs-text text-sm text-gray-600">Total:</p>
              <p className="font-turrs-text font-semibold text-turrs-blue">${order.total.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-turrs-text text-sm text-gray-600">Estado:</p>
              <p className="font-turrs-text font-semibold">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'paid' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status === 'paid' ? 'Pagado' :
                   order.status === 'pending' ? 'Pendiente' :
                   order.status}
                </span>
              </p>
            </div>
          </div>

          {/* Dirección de envío */}
          <div className="mb-4">
            <p className="font-turrs-text text-sm text-gray-600 mb-1">Dirección de envío:</p>
            <p className="font-turrs-text">
              {order.shippingAddress.street}, {order.shippingAddress.city}<br />
              {order.shippingAddress.state}, {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Método de pago */}
          <div>
            <p className="font-turrs-text text-sm text-gray-600 mb-1">Método de pago:</p>
            <p className="font-turrs-text font-semibold capitalize">
              {order.paymentMethod}
            </p>
          </div>
        </div>

        {/* Productos */}
        <div className="card-turrs text-left mb-8">
          <h2 className="font-turrs-text font-semibold text-xl mb-4">Productos</h2>
          <div className="space-y-3">
            {order.products.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                {item.productId.images && item.productId.images[0] && (
                  <img
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-turrs-text font-semibold">{item.productId.name}</p>
                  <p className="font-turrs-text text-sm text-gray-600">
                    Cantidad: {item.quantity} × ${item.price}
                  </p>
                </div>
                <p className="font-turrs-text font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="btn-turrs px-6 py-3">
            Seguir Comprando
          </Link>
          <Link to="/" className="btn-turrs-red px-6 py-3">
            Volver al Inicio
          </Link>
        </div>

        <p className="font-turrs-text text-sm text-gray-600 mt-8">
          Te hemos enviado un correo electrónico con los detalles de tu pedido.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;