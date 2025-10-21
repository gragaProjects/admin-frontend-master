import api from './api';

export const appointmentsService = {
  // Get all appointments with pagination and filters
  getAppointments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      if (params.navigatorId) queryParams.append('navigatorId', params.navigatorId);

      const response = await api.get(`/api/v1/appointments?${queryParams}`);

      // Handle case where response.data is an array directly
      if (Array.isArray(response?.data)) {
        const total = Number(response.data.length) || 0;
        const limit = Number(params.limit) || 10;
        const page = Number(params.page) || 1;
        const pages = Math.ceil(total / limit) || 1;
        return {
          data: {
            status: 'success',
            data: response.data,
            pagination: {
              total,
              page,
              pages,
              limit
            }
          }
        };
      }

      // Handle case where response has status and data properties
      if (response?.data?.status === 'success' && Array.isArray(response.data.data)) {
        // Ensure numeric pagination fields exist
        if (response.data.pagination) {
          const pg = response.data.pagination;
          response.data.pagination = {
            total: Number(pg.total) || Number(response.data.data.length) || 0,
            page: Number(pg.page) || Number(params.page) || 1,
            pages: Number(pg.pages) || 1,
            limit: Number(pg.limit) || Number(params.limit) || 10
          };
        } else {
          const total = Number(response.data.data.length) || 0;
          const limit = Number(params.limit) || 10;
          const page = Number(params.page) || 1;
          const pages = Math.ceil(total / limit) || 1;
          response.data.pagination = { total, page, pages, limit };
        }
        return response;
      }

      // If response exists but in unexpected format
      if (response?.data) {
        console.warn('Unexpected appointments response format:', response.data);
        return {
          data: {
            status: 'success',
            data: [],
            pagination: { total: 0, page: 1, pages: 1, limit: Number(params.limit) || 10 }
          }
        };
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error fetching appointments:', error);
      
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      // Handle specific HTTP status codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Session expired. Please login again.');
          case 403:
            throw new Error('You do not have permission to view appointments.');
          case 404:
            return {
              data: {
                status: 'success',
                data: [],
                pagination: { total: 0, page: 1, pages: 1, limit: Number(params.limit) || 10 }
              }
            };
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch appointments');
        }
      }

      throw error;
    }
  },

  // Get single appointment by ID
  getAppointmentById: async (id) => {
    try {
      if (!id) {
        throw new Error('Appointment ID is required');
      }

      const response = await api.get(`/api/v1/appointments/${id}`);
      
      // Log the response for debugging
      console.log('API Response:', response?.data);

      // Handle case where response.data is the appointment object directly
      if (response?.data && typeof response.data === 'object') {
        // If it's already in the success wrapper format
        if (response.data.status === 'success' && response.data.data) {
        return response;
      }
        
        // If it's a direct appointment object (has _id)
        if (response.data._id) {
          return {
            data: {
              status: 'success',
              data: response.data
            }
          };
        }
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      // Handle specific HTTP status codes
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Session expired. Please login again.');
          case 403:
            throw new Error('You do not have permission to view this appointment.');
          case 404:
            throw new Error('Appointment not found. It may have been deleted.');
          default:
            throw new Error(error.response.data?.message || 'Failed to fetch appointment details');
        }
      }
      
      throw error;
    }
  },

  // Create new appointment
  createAppointment: async (data) => {
    try {
      const response = await api.post('/api/v1/appointments', data);
      
      // Handle case where response.data is the appointment object directly
      if (response?.data && typeof response.data === 'object') {
        // If it's already in the success wrapper format
        if (response.data.status === 'success') {
      return response;
        }
        
        // If it's a direct appointment object (has _id)
        if (response.data._id) {
          return {
            data: {
              status: 'success',
              data: response.data
            }
          };
        }
      }
      
      throw new Error('Failed to create appointment');
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to create appointment');
      }

      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/v1/appointments/${id}`, { status });
      
      if (response?.data?.status === 'success') {
      return response;
      }
      
      throw new Error('Failed to update appointment status');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to update appointment status');
      }

      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (appointmentId, data) => {
    try {
      const response = await api.put(`/api/v1/appointments/${appointmentId}`, data);
      
      // Handle case where response.data is the appointment object directly
      if (response?.data && typeof response.data === 'object') {
        // If it's already in the success wrapper format
        if (response.data.status === 'success') {
          return response.data;
        }
        
        // If it's a direct appointment object (has _id)
        if (response.data._id) {
          return {
            status: 'success',
            data: response.data
          };
        }
      }
      
      throw new Error('Failed to update appointment');
    } catch (error) {
      console.error('Error updating appointment:', error);
      
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to the server. Please check your internet connection.');
      }

      if (error.response) {
        throw new Error(error.response.data?.message || 'Failed to update appointment');
      }

      throw error;
    }
  },

  // Delete appointment
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await api.delete(`/api/v1/appointments/${appointmentId}`);
      
      // Log the full response for debugging
      console.log('Full delete response:', response);
      
      // If the response itself is the data (which seems to be the case)
      if (response && response.status === 'success') {
      return response;
      }
      
      // If response has data property
      if (response?.data && response.data.status === 'success') {
        return response.data;
      }
      
      throw new Error('Failed to delete appointment');
    } catch (error) {
      console.error('Delete appointment error:', error);
      throw error;
    }
  },


  // Force PDF regeneration by updating appointment with regeneratePdf flag
  regenerateAppointmentPdf: async (appointmentId) => {
    try {
      const response = await api.put(`/api/v1/appointments/${appointmentId}`, {
        regeneratePdf: true,
        forceUpdate: true,
        timestamp: new Date().toISOString() // Add timestamp to force regeneration
      });
      
      if (response?.status === 'success' && response?.data?.pdfUrl) {
        return response.data;
      }
      
      throw new Error('Failed to regenerate appointment PDF');
    } catch (error) {
      console.error('Error regenerating appointment PDF:', error);
      throw error;
    }
  },

};

export default appointmentsService; 