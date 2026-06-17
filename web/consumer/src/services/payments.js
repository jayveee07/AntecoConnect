import api from './api';

export const paymentService = {
  getPaymentHistory: (params) => api.get('/payments', { params }),
  makePayment: (data) => api.post('/payments', data),
  getPaymentMethods: () => api.get('/payments/methods'),
};
