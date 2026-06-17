import api from './api';

export const adminDashboardService = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getRecentActivity: () => api.get('/admin/dashboard/recent-activity'),
  getChartData: () => api.get('/admin/dashboard/chart-data'),
};
