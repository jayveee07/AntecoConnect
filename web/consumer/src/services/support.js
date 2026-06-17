import api from './api';

export const supportService = {
  getTickets: (params) => api.get('/support-tickets', { params }),
  getTicket: (id) => api.get(`/support-tickets/${id}`),
  createTicket: (data) => api.post('/support-tickets', data),
  sendMessage: (ticketId, message) => api.post(`/support-tickets/${ticketId}/messages`, { message }),
  getFaqs: () => api.get('/support-tickets/faqs'),
};
