import api from './api';

export const navigatorsService = {
  getAllNavigators: async () => {
    try {
      const response = await api.get('/api/v1/navigators');
      console.log('Raw API response:', response);
      
      // If response is in { status, data } format
      if (response?.data?.status === 'success' && response?.data?.data) {
        console.log('Returning data from status success format');
        return response.data.data;
      }
      
      // If response itself is the data
      if (Array.isArray(response.data)) {
        console.log('Returning data from array format');
        return response.data;
      }
      
      // If response.data is the array directly
      if (Array.isArray(response?.data?.data)) {
        console.log('Returning data from nested data format');
        return response.data.data;
      }
      
      console.error('Unexpected navigator response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching navigators:', error);
      return [];
    }
  },

  getNavigators: async (params = {}) => {
    const { page = 1, limit = 10, search, role = 'navigator', gender, languages, rating } = params;
    
    let url = '/api/v1/navigators?';
    const queryParams = [];
    
    // Add base params
    queryParams.push(`page=${page}`);
    queryParams.push(`limit=${limit}`);
    queryParams.push(`role=${role}`);
    
    // Add optional params
    if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
    if (gender) queryParams.push(`gender=${encodeURIComponent(gender)}`);
    if (languages) queryParams.push(`languages=${languages}`); // Don't encode the comma
    if (rating) queryParams.push(`rating=${encodeURIComponent(rating)}`);
    
    return api.get(url + queryParams.join('&'));
  },

  getNavigatorById: async (id) => {
    return api.get(`/api/v1/navigators/${id}`);
  },

  createNavigator: async (data) => {
    // Create the request data
    const requestData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      languagesSpoken: data.languagesSpoken,
      introduction: data.introduction,
      profilePic: data.profilePic // Use the profilePic URL directly
    };

    // Send the data as JSON
    return api.post('/api/v1/navigators', requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  updateNavigator: async (id, data) => {
    // Create the request data - include all fields
    const requestData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      dob: data.dob,
      gender: data.gender,
      languagesSpoken: data.languagesSpoken,
      introduction: data.introduction,
      profilePic: data.profilePic
    };

    return api.put(`/api/v1/navigators/${id}`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  deleteNavigator: async (id) => {
    return api.delete(`/api/v1/navigators/${id}`);
  },

  getNavigatorProfilePdf: async (id) => {
    try {
      const response = await api.get(`/api/v1/navigators/${id}/profile-pdf`);
      if (response?.status === 'success' && response?.data?.s3Url) {
        return response.data;
      }
      throw new Error('Failed to generate navigator profile PDF');
    } catch (error) {
      console.error('Error generating navigator profile PDF:', error);
      throw error;
    }
  }
}; 