import api from '../lib/utils/api';

export const beatsService = {
  // Get all beats
  getAllBeats: async () => {
    try {
      const response = await api.get('/beats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get beat by ID
  getBeatById: async (beatId) => {
    try {
      const response = await api.get(`/beats/${beatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get beats assigned to an officer
  getOfficerBeats: async (officerId) => {
    try {
      const response = await api.get(`/beats/officer/${officerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new beat
  createBeat: async (beatData) => {
    try {
      const response = await api.post('/beats', beatData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update beat
  updateBeat: async (beatId, beatData) => {
    try {
      const response = await api.put(`/beats/${beatId}`, beatData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete beat
  deleteBeat: async (beatId) => {
    try {
      const response = await api.delete(`/beats/${beatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Assign beat to officer
  assignBeat: async (beatId, officerId) => {
    try {
      const response = await api.post(`/beats/${beatId}/assign`, { officerId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get active beats
  getActiveBeats: async () => {
    try {
      const response = await api.get('/beats/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default beatsService;