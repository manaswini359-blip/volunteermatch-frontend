import api from './api';

export const organizationService = {
  getMyProfile: async () => {
    const response = await api.get('/organizations/me');
    return response.data?.data;
  },

  getProfileById: async (id) => {
    const response = await api.get(`/organizations/${id}`);
    return response.data?.data;
  },

  updateProfile: async (id, data) => {
    const response = await api.put(`/organizations/${id}`, data);
    return response.data?.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/organizations/dashboard-stats');
    return response.data?.data;
  }
};
