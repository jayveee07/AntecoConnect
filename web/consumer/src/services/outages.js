import api from './api';

export const outageService = {
  getOutages: (params) => api.get('/outages', { params }),
  getOutage: (id) => api.get(`/outages/${id}`),
  reportOutage: (data) => api.post('/outages', data),
  trackOutage: (id) => api.get(`/outages/${id}/track`),
};
