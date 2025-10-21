import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/v1/auth/login', {
      email,
      password
    });

    // The response is already processed by the interceptor
    // No need to check response.data as the interceptor returns the data directly
    return response;
  } catch (error) {
    // If the error has a message, use it, otherwise use a default message
    throw new Error(error.message || 'Login failed. Please try again.');
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/api/v1/auth/forgot-password', {
      email
    });

    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to send temporary password');
  }
};

export const resetPassword = async (password, token) => {
  try {
    const response = await api.post('/api/v1/auth/reset-password', 
      { password },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to reset password');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
}; 