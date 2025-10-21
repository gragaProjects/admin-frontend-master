import api from './api'

const BASE_URL = '/api/v1/media'

export const uploadMedia = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Upload Response:', response)

    // The response is already processed by the interceptor
    // Just check if we have the required data
    if (response && response.imageUrl) {
      return {
        success: true,
        imageUrl: response.imageUrl,
        metadata: response.metadata || {}
      };
    }

    throw new Error('Invalid response format from upload service');
  } catch (error) {
    console.error('Error uploading file:', {
      message: error.message,
      response: error.response,
      status: error.status
    });
    
    // If we have a specific error message from the server
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    // If we have a network or other error
    throw new Error(error.message || 'Failed to upload file');
  }
} 