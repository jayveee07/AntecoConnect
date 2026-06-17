import api from './api';

export const serviceRequestService = {
  getRequests: (params) => api.get('/service-requests', { params }),
  getRequest: (id) => api.get(`/service-requests/${id}`),
  createRequest: (data) => api.post('/service-requests', data),
  cancelRequest: (id) => api.put(`/service-requests/${id}/cancel`),
};
