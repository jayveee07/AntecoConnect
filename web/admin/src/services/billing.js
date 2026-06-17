import api from './api';

export const adminBillingService = {
  getAll: (params) => api.get('/admin/bills', { params }),
  get: (id) => api.get(`/admin/bills/${id}`),
  generate: (data) => api.post('/admin/bills/generate', data),
  getRates: () => api.get('/admin/rates'),
  updateRate: (id, data) => api.put(`/admin/rates/${id}`, data),
};
