import api from './api';

export const consumerService = {
  getAll: (params) => api.get('/admin/consumers', { params }),
  get: (id) => api.get(`/admin/consumers/${id}`),
  create: (data) => api.post('/admin/consumers', data),
  update: (id, data) => api.put(`/admin/consumers/${id}`, data),
  delete: (id) => api.delete(`/admin/consumers/${id}`),
};
