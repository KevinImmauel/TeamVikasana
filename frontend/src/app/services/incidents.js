import api from '../lib/utils/api';

export const incidentsService = {
  // Get all incidents
  getAllIncidents: async () => {
    try {
      const response = await api.get('/incidents');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get incident by ID
  getIncidentById: async (incidentId) => {
    try {
      const response = await api.get(`/incidents/${incidentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get incidents by beat
  getIncidentsByBeat: async (beatId) => {
    try {
      const response = await api.get(`/incidents/beat/${beatId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Report new incident
  reportIncident: async (incidentData) => {
    try {
      const response = await api.post('/incidents', incidentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update incident
  updateIncident: async (incidentId, incidentData) => {
    try {
      const response = await api.put(`/incidents/${incidentId}`, incidentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete incident
  deleteIncident: async (incidentId) => {
    try {
      const response = await api.delete(`/incidents/${incidentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recent incidents
  getRecentIncidents: async (limit = 10) => {
    try {
      const response = await api.get(`/incidents/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get incident statistics
  getIncidentStats: async () => {
    try {
      const response = await api.get('/incidents/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default incidentsService;