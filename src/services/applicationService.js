import api from './api';

export const applicationService = {
  applyForEvent: async (eventId, payload) => {
    const body = typeof payload === 'object' ? payload : { availabilityConfirmed: Boolean(payload) };
    const response = await api.post(`/events/${eventId}/apply`, body);
    return response.data?.data;
  },

  getApplicationsByEvent: async (eventId) => {
    const response = await api.get(`/events/${eventId}/applications`);
    return response.data?.data || [];
  },

  getApplicationsByVolunteer: async (volunteerId) => {
    const response = await api.get(`/volunteers/${volunteerId}/applications`);
    return response.data?.data || [];
  },

  getApplicationsByOrganization: async (orgId) => {
    const response = await api.get(`/organizations/${orgId}/applications`);
    return response.data?.data || [];
  },

  updateStatus: async (applicationId, status) => {
    const response = await api.put(`/applications/${applicationId}/status`, { status });
    return response.data?.data;
  },

  withdraw: async (applicationId) => {
    const response = await api.put(`/applications/${applicationId}/withdraw`);
    return response.data?.data;
  }
};
