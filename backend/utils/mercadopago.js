// Cambiar esto:
import mercadopago from 'mercadopago';

// Por esto:
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

// Configurar MercadoPago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

export const createPreference = async (items, orderId) => {
  try {
    const preference = new Preference(client);
    
    const preferenceData = {
      body: {
        items: items.map(item => ({
          title: item.name,
          unit_price: Number(item.price),
          quantity: Number(item.quantity),
          picture_url: item.images?.[0] || '',
          description: item.description?.substring(0, 255) || ''
        })),
        back_urls: {
          success: `${process.env.FRONTEND_URL}/order-confirmation/${orderId}`,
          failure: `${process.env.FRONTEND_URL}/payment/error`,
          pending: `${process.env.FRONTEND_URL}/payment/pending`
        },
        auto_return: 'approved',
        external_reference: orderId,
        notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      }
    };

    const response = await preference.create(preferenceData);
    return response;
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    throw new Error('Error al crear la preferencia de pago');
  }
};

export const getPayment = async (paymentId) => {
  try {
    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });
    return response;
  } catch (error) {
    console.error('Error getting payment:', error);
    throw new Error('Error al obtener el pago');
  }
};