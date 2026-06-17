import api from './api';

export const announcementService = {
  getAll: () => api.get('/admin/announcements'),
  get: (id) => api.get(`/admin/announcements/${id}`),
  create: (data) => api.post('/admin/announcements', data),
  update: (id, data) => api.put(`/admin/announcements/${id}`, data),
  delete: (id) => api.delete(`/admin/announcements/${id}`),
};
