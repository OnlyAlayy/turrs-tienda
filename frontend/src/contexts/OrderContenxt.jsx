import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder debe ser usado dentro de un OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      setCurrentOrder(response.data);
      return { success: true, order: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error al crear la orden' 
      };
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener la orden');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la orden');
    }
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  const value = {
    currentOrder,
    loading,
    createOrder,
    getOrder,
    updateOrderStatus,
    clearCurrentOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};