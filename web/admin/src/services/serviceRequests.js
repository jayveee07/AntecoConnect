import api from './api';

export const adminServiceRequestService = {
  getAll: (params) => api.get('/admin/service-requests', { params }),
  get: (id) => api.get(`/admin/service-requests/${id}`),
  update: (id, data) => api.put(`/admin/service-requests/${id}`, data),
};
