import api from './api';

export const billingService = {
  getBills: (params) => api.get('/bills', { params }),
  getBill: (id) => api.get(`/bills/${id}`),
  getCurrentBill: () => api.get('/bills/current'),
};
