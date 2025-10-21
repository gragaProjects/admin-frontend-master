import api from './api';

export const getAllInfirmaryRecords = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add each parameter to the query string
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const response = await api.get(`/api/v1/infirmary${queryString ? `?${queryString}` : ''}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getInfirmaryRecordById = async (id) => {
  try {
    const response = await api.get(`/api/v1/infirmary/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createInfirmaryRecord = async (data) => {
  try {
    // Log the request data
    console.log('Making infirmary API request with data:', data);
    
    const response = await api.post('/api/v1/infirmary', {
      ...data,
      schoolId: data.schoolId,  // Ensure these are explicitly included
      nurseId: data.nurseId
    });
    return response.data;
  } catch (error) {
    console.error('Infirmary API error:', {
      message: error.message,
      data: error.response?.data
    });
    throw error;
  }
};

export const updateInfirmaryRecord = async (id, data) => {
  try {
    const response = await api.put(`/api/v1/infirmary/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteInfirmaryRecord = async (id) => {
  try {
    const response = await api.delete(`/api/v1/infirmary/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const infirmaryService = {
  getAllInfirmaryRecords,
  getInfirmaryRecordById,
  createInfirmaryRecord,
  updateInfirmaryRecord,
  deleteInfirmaryRecord
}; 