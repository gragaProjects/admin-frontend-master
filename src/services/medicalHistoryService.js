import api from './api';

export const medicalHistoryService = {
  getMedicalHistoryById: async (historyId, memberId) => {
    try {
      if (!historyId || !memberId) {
        throw new Error('Both History ID and Member ID are required');
      }

      const response = await api.get(`/api/v1/medical-history/${memberId}?id=${historyId}`);
      
      if (response?.status === 'success' && response?.data) {
        return response;
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error fetching medical history:', error);
      throw error;
    }
  },

  getMedicalHistoryByMemberId: async (memberId) => {
    try {
      if (!memberId) {
        throw new Error('Member ID is required');
      }

      const response = await api.get(`/api/v1/medical-history/${memberId}`);
      
      if (response?.status === 'success' && response?.data) {
        return response;
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error fetching medical history:', error);
      throw error;
    }
  },

  createMedicalHistory: async (data) => {
    try {
      if (!data.memberId) {
        throw new Error('Member ID is required');
      }

      const response = await api.post(`/api/v1/medical-history/${data.memberId}`, data);
      
      if (response?.status === 'success' && response?.data) {
        return response;
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error creating medical history:', error);
      throw error;
    }
  },

  updateMedicalHistory: async (historyId, memberId, data) => {
    try {
      if (!historyId || !memberId) {
        throw new Error('Both History ID and Member ID are required');
      }

      const response = await api.patch(`/api/v1/medical-history/${memberId}?id=${historyId}`, data);
      
      if (response?.status === 'success' && response?.data) {
        return response;
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error updating medical history:', error);
      throw error;
    }
  },

  deleteMedicalHistory: async (historyId, memberId) => {
    try {
      if (!historyId || !memberId) {
        throw new Error('Both History ID and Member ID are required');
      }

      const response = await api.delete(`/api/v1/medical-history/${memberId}?id=${historyId}`);
      
      if (response?.status === 'success') {
        return response;
      }
      
      throw new Error('Invalid response structure from API');
    } catch (error) {
      console.error('Error deleting medical history:', error);
      throw error;
    }
  }
};

export default medicalHistoryService; 