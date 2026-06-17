import api from './api';

export const workOrderService = {
  getAll: (params) => api.get('/admin/work-orders', { params }),
  get: (id) => api.get(`/admin/work-orders/${id}`),
  assign: (id, technicianId) => api.post(`/admin/work-orders/${id}/assign`, { technician_id: technicianId }),
  updateStatus: (id, status) => api.put(`/admin/work-orders/${id}/status`, { status }),
};
