import api from './api';

export const reportService = {
  generate: (params) => api.get('/admin/reports/generate', { params }),
  getHistory: () => api.get('/admin/reports'),
  download: (id) => api.get(`/admin/reports/${id}/download`, { responseType: 'blob' }),
};
