import api from './api';

export const profileService = {
  getProfile: async () => {
    try {
      const response = await api.get('/api/v1/admins');
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      // Get userId from auth credentials
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.userId;
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Format the data according to API requirements
      const formattedData = {
        name: profileData.name,
        phone: profileData.phoneNumber, // Map phoneNumber to phone
        dob: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString() : undefined, // Convert to ISO string
        gender: profileData.gender,
        profilePic: profileData.profilePic // Use the imageUrl directly from upload response
      };

      // Remove undefined fields
      Object.keys(formattedData).forEach(key => 
        formattedData[key] === undefined && delete formattedData[key]
      );

      const response = await api.put(`/api/v1/admins`, formattedData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default profileService; 