import api from './api';

export const certificateService = {
  issueCertificate: async (eventId, volunteerId) => {
    const response = await api.post('/certificates', { eventId, volunteerId });
    return response.data?.data;
  },

  getVolunteerCertificates: async (volunteerId) => {
    const response = await api.get(`/volunteers/${volunteerId}/certificates`);
    return response.data?.data || [];
  },

  getEventCertificates: async (eventId) => {
    const response = await api.get(`/events/${eventId}/certificates`);
    return response.data?.data || [];
  },

  getCertificateById: async (certificateId) => {
    const response = await api.get(`/certificates/${certificateId}`);
    return response.data?.data;
  }
};
