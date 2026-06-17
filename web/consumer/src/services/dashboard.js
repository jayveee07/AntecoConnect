import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getConsumptionChart: () => api.get('/dashboard/consumption-chart'),
  getRecentBills: () => api.get('/dashboard/recent-bills'),
  getNotifications: () => api.get('/dashboard/notifications'),
};
