import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('turrs-cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('turrs-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      // Uniqueness is defined by both ID and chosen size
      const uniqueId = product.size ? `${product._id}-${product.size}` : product._id;

      const existingItemIndex = prevItems.findIndex(item => {
        const itemUniqueId = item.size ? `${item._id}-${item.size}` : item._id;
        return itemUniqueId === uniqueId;
      });

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += (product.quantity || quantity);
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity: product.quantity || quantity }];
      }
    });
    // Can optionally auto-open cart:
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size = null) => {
    setCartItems(prevItems => prevItems.filter(item => {
      const itemUniqueId = item.size ? `${item._id}-${item.size}` : item._id;
      const removeUniqueId = size ? `${productId}-${size}` : productId;
      return itemUniqueId !== removeUniqueId;
    }));
  };

  const updateQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        const itemUniqueId = item.size ? `${item._id}-${item.size}` : item._id;
        const targetUniqueId = size ? `${productId}-${size}` : productId;
        return itemUniqueId === targetUniqueId ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};