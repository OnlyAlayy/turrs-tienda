// Cart.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="font-turrs-title text-3xl text-turrs-blue mb-4">Tu Carrito está vacío</h1>
          <p className="font-turrs-text text-gray-600 mb-8">
            ¡Descubre nuestros productos y agrega algo especial!
          </p>
          <Link to="/products" className="btn-turrs px-6 py-3">
            Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="font-turrs-title text-3xl text-turrs-blue mb-8">Tu Carrito de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="card-turrs flex items-center space-x-4">
                {item.images && item.images[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex-1">
                  <h3 className="font-turrs-text font-semibold">{item.name}</h3>
                  <p className="font-turrs-text text-turrs-blue font-bold">${item.price}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="font-turrs-text font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-turrs-text font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 font-turrs-text"
            >
              Vaciar carrito
            </button>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="card-turrs sticky top-4">
            <h2 className="font-turrs-text font-semibold text-xl mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span className="font-turrs-text text-sm">{item.name} x{item.quantity}</span>
                  <span className="font-turrs-text text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-turrs-text font-semibold">Total:</span>
                <span className="font-turrs-text font-bold text-xl text-turrs-blue">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>

              {/* Botón cambiado a Link */}
              <Link
                to="/checkout"
                className="w-full btn-turrs-red py-3 text-lg text-center block"
              >
                Proceder al Pago
              </Link>

              <Link to="/products" className="block text-center mt-4 text-turrs-blue hover:underline">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
