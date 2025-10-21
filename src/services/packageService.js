import api from './api';

export const packageService = {
  getAllPackages: async (page = 1) => {
    try {
      const response = await api.get(`/api/v1/packages`);
      return response;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  getPackageById: async (id) => {
    try {
      const response = await api.get(`/api/v1/packages/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching package details:', error);
      throw error;
    }
  },

  createPackage: async (packageData) => {
    try {
      const response = await api.post('/api/v1/packages', packageData);
      return response;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  },

  updatePackage: async (id, packageData) => {
    try {
      const response = await api.put(`/api/v1/packages/${id}`, packageData);
      return response;
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  },

  deletePackage: async (id) => {
    try {
      const response = await api.delete(`/api/v1/packages/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }
}; 