import api from './api';

export const aiService = {
  analyzeEvent: async (title, description, category) => {
    const response = await api.post('/ai/analyze-event', { title, description, category });
    return response.data?.data;
  },

  getRecommendations: async (eventId) => {
    const response = await api.get(`/ai/events/${eventId}/recommendations`);
    return response.data?.data || [];
  }
};
