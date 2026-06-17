import api from './api';

export const adminPaymentService = {
  getAll: (params) => api.get('/admin/payments', { params }),
  get: (id) => api.get(`/admin/payments/${id}`),
  refund: (id) => api.post(`/admin/payments/${id}/refund`),
};
