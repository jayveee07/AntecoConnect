import api from './api';

export const gisService = {
  getAssets: () => api.get('/admin/gis/assets'),
  getFeeders: () => api.get('/admin/gis/feeders'),
  getTransformers: () => api.get('/admin/gis/transformers'),
  getPoles: () => api.get('/admin/gis/poles'),
};
