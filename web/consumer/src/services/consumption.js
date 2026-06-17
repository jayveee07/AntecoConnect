import api from './api';

export const consumptionService = {
  getConsumption: (params) => api.get('/consumption', { params }),
  getForecast: () => api.get('/consumption/forecast'),
  getSavingTips: () => api.get('/consumption/saving-tips'),
};
