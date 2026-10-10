import api from './api';

export const attendanceService = {
  markAttendance: async (eventId, volunteerId, status) => {
    const response = await api.post('/attendance', { eventId, volunteerId, status });
    return response.data?.data;
  },

  getEventAttendance: async (eventId) => {
    const response = await api.get(`/events/${eventId}/attendance`);
    return response.data?.data || [];
  },

  getVolunteerAttendance: async (volunteerId) => {
    const response = await api.get(`/volunteers/${volunteerId}/attendance`);
    return response.data?.data || [];
  }
};
