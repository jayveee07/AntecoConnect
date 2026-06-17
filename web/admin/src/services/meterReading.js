import api from './api';

export const meterReadingService = {
  getSchedule: () => api.get('/admin/meter-readings/schedule'),
  getReadings: (params) => api.get('/admin/meter-readings', { params }),
  approve: (id) => api.post(`/admin/meter-readings/${id}/approve`),
};
