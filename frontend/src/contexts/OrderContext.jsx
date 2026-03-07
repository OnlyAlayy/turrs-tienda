import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

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

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/orders`, orderData);
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
      const response = await axios.get(`${API_URL}/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener la orden');
    }
  };

  const getUserOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders/my-orders`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener tus órdenes');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`${API_URL}/api/orders/${orderId}`, { status });
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
    getUserOrders,
    updateOrderStatus,
    clearCurrentOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};