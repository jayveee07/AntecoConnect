import api from './api';

export const adminOutageService = {
  getAll: (params) => api.get('/admin/outages', { params }),
  get: (id) => api.get(`/admin/outages/${id}`),
  update: (id, data) => api.put(`/admin/outages/${id}`, data),
  resolve: (id) => api.post(`/admin/outages/${id}/resolve`),
};
