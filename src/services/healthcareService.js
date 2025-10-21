import api from './api';

export const healthcareService = {
  getAllHealthcareProviders: async (page = 1) => {
    try {
      const response = await api.get(`/api/v1/hc-providers?page=${page}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getHealthcareProviderById: async (id) => {
    try {
      const response = await api.get(`/api/v1/hc-providers/${id}`);
      if (response?.status === 'success' && response?.data) {
        return response;
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      throw error;
    }
  },

  createHealthcareProvider: async (data) => {
    try {
      // Remove any MongoDB specific fields if they exist
      const { _id, __v, ...cleanData } = data;
      
      const response = await api.post('/api/v1/hc-providers', cleanData);
      
      if (response?.status === 'success') {
        return response;
      } else {
        throw new Error(response?.message || 'Failed to create healthcare provider');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  updateHealthcareProvider: async (id, data) => {
    try {
      // Remove any MongoDB specific fields if they exist
      const { _id, __v, createdAt, updatedAt, ...cleanData } = data;
      
      // Clean up nested objects
      if (cleanData.address) {
        delete cleanData.address._id;
      }
      if (cleanData.operationHours) {
        cleanData.operationHours = cleanData.operationHours.map(({ _id, ...day }) => day);
      }

      const response = await api.put(`/api/v1/hc-providers/${id}`, cleanData);
      
      if (response?.status === 'success') {
        return response;
      } else {
        throw new Error(response?.message || 'Failed to update healthcare provider');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },

  deleteHealthcareProvider: async (id) => {
    try {
      await api.delete(`/api/v1/hc-providers/${id}`);
      // For DELETE operations, we consider any non-error response as successful
      return { status: 'success' };
    } catch (error) {
      if (error.response?.status === 404) {
        // If the provider is not found, we consider it as already deleted
        return { status: 'success' };
      }
      // For other errors, throw them
      throw new Error(error.response?.data?.message || 'Failed to delete healthcare provider');
    }
  },

  getRegionsByPincode: async (pincode) => {
    try {
      // Using India Post pincode API
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === 'Success') {
        const postOffices = data[0].PostOffice;
        return {
          status: 'success',
          data: {
            regions: postOffices.map(office => ({
              value: office.Name,
              label: office.Name
            })),
            state: postOffices[0].State,
            city: postOffices[0].District
          }
        };
      } else {
        throw new Error('Invalid pincode or no data found');
      }
    } catch (error) {
      throw error;
    }
  }
}; 