import api from './api';

export const getStats = async () => {
  try {
    const response = await api.get('/api/v1/admins/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
}; 