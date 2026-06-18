import api from './api';

export const dashboardService = {
  getAll: () => api.get('/dashboard'),
};
