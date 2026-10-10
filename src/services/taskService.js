import api from './api';

export const taskService = {
  assignTask: async (eventId, volunteerId, taskName) => {
    const response = await api.post('/tasks', { eventId, volunteerId, taskName });
    return response.data?.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await api.put(`/tasks/${taskId}`, { status });
    return response.data?.data;
  },

  getVolunteerTasks: async (volunteerId) => {
    const response = await api.get(`/volunteers/${volunteerId}/tasks`);
    return response.data?.data || [];
  },

  getEventTasks: async (eventId) => {
    const response = await api.get(`/events/${eventId}/tasks`);
    return response.data?.data || [];
  }
};
