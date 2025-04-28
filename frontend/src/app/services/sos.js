import api from '../lib/utils/api';

export const sosService = {
  // Get all active SOS alerts
  getActiveAlerts: async () => {
    try {
      const response = await api.get('/sos/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get SOS alert by ID
  getAlertById: async (alertId) => {
    try {
      const response = await api.get(`/sos/${alertId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new SOS alert
  createAlert: async (alertData) => {
    try {
      const response = await api.post('/sos', alertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update SOS alert
  updateAlert: async (alertId, alertData) => {
    try {
      const response = await api.put(`/sos/${alertId}`, alertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Resolve SOS alert
  resolveAlert: async (alertId, resolutionDetails) => {
    try {
      const response = await api.post(`/sos/${alertId}/resolve`, resolutionDetails);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get SOS alerts by officer
  getOfficerAlerts: async (officerId) => {
    try {
      const response = await api.get(`/sos/officer/${officerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  // Get SOS alerts statistics
  getAlertStats: async () => {
    try {
      const response = await api.get('/sos/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default sosService;