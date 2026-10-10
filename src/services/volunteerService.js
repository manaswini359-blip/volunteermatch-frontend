import api from './api';

export const volunteerService = {
  getMyProfile: async () => {
    const response = await api.get('/volunteers/me');
    return response.data?.data;
  },

  getProfileById: async (id) => {
    const response = await api.get(`/volunteers/${id}`);
    return response.data?.data;
  },

  updateProfile: async (id, data) => {
    const response = await api.put(`/volunteers/${id}`, data);
    return response.data?.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/volunteers/dashboard-stats');
    return response.data?.data;
  },

  getAllVolunteers: async () => {
    const response = await api.get('/volunteers');
    return response.data?.data || [];
  }
};
