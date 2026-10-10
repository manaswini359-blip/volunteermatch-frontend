import api from './api';

export const eventService = {
  getAllEvents: async () => {
    const response = await api.get('/events');
    return response.data?.data || [];
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data?.data;
  },

  getOrgEvents: async (orgId) => {
    const response = await api.get(`/events/organization/${orgId}`);
    return response.data?.data || [];
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data?.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data?.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  }
};
