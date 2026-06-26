import api from './api';

export const settingsService = {
  get: () => api.get('/admin/settings'),
  update: (data) => api.put('/admin/settings', data),
};
