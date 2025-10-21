import api from './api';

// Export the service object as a named export
export const nursesService = {
  getNurses: async (params = {}) => {
    const { page = 1, limit = 10, search, gender, languages, rating } = params;
    
    let url = '/api/v1/nurses?';
    const queryParams = [];
    
    // Add base params
    queryParams.push(`page=${page}`);
    queryParams.push(`limit=${limit}`);
    
    // Add optional params
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (gender) queryParams.push(`gender=${encodeURIComponent(gender)}`);
    if (languages) queryParams.push(`languages=${languages}`); // Don't encode the comma
    if (rating) queryParams.push(`rating=${encodeURIComponent(rating)}`);
    
    return api.get(url + queryParams.join('&'));
  },

  getNurseById: async (id) => {
    return api.get(`/api/v1/nurses/${id}`);
  },

  createNurse: async (data) => {
    try {
      console.log('Creating nurse with data:', data);
      
      // Format the request data according to the API requirements
      const requestData = {
        name: data.name,
        email: data.email?.toLowerCase(),
        phone: data.phone,
        dob: new Date(data.dob).toISOString(), // Ensure proper date format
        gender: data.gender?.toLowerCase(),
        profilePic: data.profilePic,
        schoolId: data.schoolId,
        languagesSpoken: Array.isArray(data.languagesSpoken) ? data.languagesSpoken : [],
        introduction: data.introduction?.trim()
      };

      console.log('Formatted request data:', requestData);
      const response = await api.post('/api/v1/nurses', requestData);
      console.log('Create nurse response:', response);

      // Check if we have a valid response
      if (response && response.data) {
        return {
          status: 'success',
          data: response.data.data,
          message: 'Nurse created successfully'
        };
      }

      // If no valid response, throw an error
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error in createNurse:', {
        message: error.message,
        response: error.response?.data
      });
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw {
          message: error.response.data.message || 'Invalid nurse data',
          type: 'validation'
        };
      } else if (error.response?.status === 401) {
        throw {
          message: 'Unauthorized. Please log in again.',
          type: 'auth'
        };
      } else if (error.response?.status === 403) {
        throw {
          message: 'You do not have permission to create nurses.',
          type: 'permission'
        };
      }
      
      // For other errors, throw a standardized error structure
      throw {
        message: error.message || 'Failed to create nurse',
        type: 'unknown'
      };
    }
  },

  updateNurse: async (id, data) => {
    // Format the request data for update - only include fields that are present in the update data
    const requestData = {};

    // Only add fields that are present in the update data
    if (data.name !== undefined) requestData.name = data.name;
    if (data.email !== undefined) requestData.email = data.email?.trim();
    if (data.phone !== undefined) requestData.phone = data.phone;
    if (data.dob !== undefined) requestData.dob = new Date(data.dob).toISOString();
    if (data.gender !== undefined) requestData.gender = data.gender?.toLowerCase();
    if (data.profilePic !== undefined) requestData.profilePic = data.profilePic;
    if (data.schoolId !== undefined) requestData.schoolId = data.schoolId;
    if (data.languagesSpoken !== undefined) requestData.languagesSpoken = Array.isArray(data.languagesSpoken) ? data.languagesSpoken : [];
    if (data.introduction !== undefined) requestData.introduction = data.introduction?.trim();

    return api.put(`/api/v1/nurses/${id}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  deleteNurse: async (id) => {
    return api.delete(`/api/v1/nurses/${id}`);
  },

  getAllNurses: async () => {
    try {
      const response = await api.get('/api/v1/nurses');
      console.log('Raw nurses response:', response);
      
      // If response is in { status, data } format
      if (response?.data?.status === 'success' && response?.data?.data) {
        return response.data.data;
      }
      
      // If response itself is the data
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // If response.data is the array directly
      if (Array.isArray(response?.data?.data)) {
        return response.data.data;
      }
      
      console.error('Unexpected nurses response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching nurses:', error);
      return [];
    }
  },

  assignNavigator: async (data) => {
    try {
      const response = await api.patch('/api/v1/nurses/assign-navigator', {
        navigatorId: data.navigatorId,
        nurseId: data.nurseId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response && response.status === 'success') {
        return response;
      } else {
        throw new Error(response?.message || 'Failed to assign navigator');
      }
    } catch (error) {
      console.error('Error assigning navigator:', error);
      throw error;
    }
  },

  getNurseProfilePdf: async (id) => {
    try {
      const response = await api.get(`/api/v1/nurses/${id}/profile-pdf`);
      if (response?.status === 'success' && response?.data?.s3Url) {
        return response.data;
      }
      throw new Error('Failed to generate nurse profile PDF');
    } catch (error) {
      console.error('Error generating nurse profile PDF:', error);
      throw error;
    }
  }
}; 