
// 17.10.25
// }; 
import axios from "axios";

const base = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/v1` : '/api/v1';

const api = axios.create({ baseURL: `${base}/doctors`, headers: { 'Content-Type': 'application/json' } });
// 17.10.25
const BASE = axios.create({ baseURL: `${base}/healthcaredoctors`, headers: { 'Content-Type': 'application/json' } });
//const BASE = `${base}/healthcaredoctors`;
export const doctorsService = {
  getAllDoctors: async () => {
    try {
      const response = await api.get('/api/v1/doctors');
      console.log('Raw doctor response:', response);
      
      // If response is in { status, data } format
      if (response?.status === 'success' && response?.data) {
        return response.data;
      }
      
      // If response itself is the data
      if (Array.isArray(response)) {
        return response;
      }
      
      // If response.data is the array directly
      if (Array.isArray(response?.data)) {
        return response.data;
      }
      
      console.error('Unexpected doctor response format:', response);
      return [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  },

  getDoctors: async (params = {}) => {
    console.log('Service - getDoctors called with raw params:', params);
    
    const { 
      page = 1, 
      limit = 10, 
      doctorName,
      serviceType, 
      languages, 
      areas,
      doctorId,
      pincode
    } = params;
    
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    
    // Add parameters only if they have values
    if (doctorName) queryParams.append('doctorName', doctorName);
    if (doctorId) {
      console.log('Service - Adding doctorId param:', doctorId);
      queryParams.append('doctorId', doctorId);
    }
    if (pincode) {
      console.log('Service - Adding pincode param:', pincode);
      queryParams.append('pincode', pincode);
    }
    
    // Only add serviceType if it's defined and not 'all'
    if (serviceType && serviceType !== 'all') {
      const normalizedServiceType = serviceType.toLowerCase();
      console.log('Service - Adding serviceType param:', normalizedServiceType);
      queryParams.append('serviceType', normalizedServiceType);
    }

    if (languages?.length) queryParams.append('languages', languages.join(','));
    if (areas?.length) queryParams.append('areas', areas.join(','));

    const queryString = queryParams.toString();
    console.log('Service - Final query string:', queryString);
    
    const url = `/api/v1/doctors?${queryString}`;
    console.log('Service - Making API call to:', url);
    
    return api.get(url);
  },

  getDoctorById: async (id) => {
    try {
      console.log('Fetching doctor details for ID:', id);
      const response = await api.get(`/api/v1/doctors/${id}`);
      
      if (response.status === 'success' && response.data) {
        console.log('Successfully fetched doctor details:', response.data);
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response structure from doctor API');
      }
    } catch (error) {
      console.error('Get doctor by ID error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch doctor details');
    }
  },

  uploadMedia: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', file.name, file.type, file.size);

      const response = await api.post('/api/v1/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response);

      // Check if response exists and has the expected structure
      if (response && response.success && response.imageUrl) {
        console.log('Successfully uploaded file. URL:', response.imageUrl);
        return response.imageUrl;
      }

      // If we get here, the response structure is unexpected
      console.error('Unexpected response structure:', response);
      throw new Error('Invalid response structure from upload API');
    } catch (error) {
      console.error('Upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to upload file');
    }
  },

  createDoctor: async (doctorData) => {
    try {
      console.log('Creating doctor with data:', doctorData);
      const response = await api.post('/api/v1/doctors', doctorData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Check if the response has the expected structure
      if (response && response.status === 'success' && response.data) {
        return response;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Create doctor error:', error);
      if (error.response?.data?.message) {
        // Check for specific error messages
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('already exists')) {
          throw new Error('A doctor with this email or phone number already exists. Please use different contact details.');
        }
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create doctor');
    }
  },

  deleteDoctor: async (doctorId) => {
    try {
      console.log('Deleting doctor with ID:', doctorId);
      const response = await api.delete(`/api/v1/doctors/${doctorId}`);
      console.log('Delete API response:', response);
      
      if (response.status === 'success') {
        console.log('Successfully deleted doctor:', response.message);
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error(response.message || 'Failed to delete doctor');
      }
    } catch (error) {
      console.error('Delete doctor error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to delete doctor');
    }
  },

  updateDoctor: async (doctorId, doctorData) => {
    try {
      console.log('Updating doctor with ID:', doctorId);
      console.log('Update data:', doctorData);
      
      const response = await api.put(`/api/v1/doctors/${doctorId}`, doctorData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Update API response:', response);
      
      if (response && response.status === 'success') {
        console.log('Successfully updated doctor:', response.message);
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error(response?.message || 'Failed to update doctor');
      }
    } catch (error) {
      console.error('Update doctor error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update doctor');
    }
  },

  assignNavigator: async (doctorId, navigatorId) => {
    try {
      console.log('Assigning navigator to doctor:', { doctorId, navigatorId });
      
      const response = await api.patch(`/api/v1/doctors/assign/navigator`, {
        navigatorId,
        doctorId
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Assign navigator API response:', response);
      
      if (response && response.status === 'success') {
        console.log('Successfully assigned navigator:', response.message);
        return response;
      } else {
        console.error('Invalid response structure:', response);
        throw new Error(response?.message || 'Failed to assign navigator');
      }
    } catch (error) {
      console.error('Assign navigator error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to assign navigator');
    }
  },

  getDoctorProfilePdf: async (id) => {
    try {
      const response = await api.get(`/api/v1/doctors/${id}/profile-pdf`);
      if (response?.status === 'success' && response?.data?.s3Url) {
        return response.data;
      }
      throw new Error('Failed to generate doctor profile PDF');
    } catch (error) {
      console.error('Error generating doctor profile PDF:', error);
      throw error;
    }
  },


  // 17.11.25
   // Specialties
  getSpecialties: () => BASE.get("/specialties/list").then(res => res.data),

  // SubSpecialties by specialty
  getSubSpecialties: (specialtyId) =>
    BASE.get(`/subspecialties/${specialtyId}`).then(res => res.data),

  // CRUD Doctors
  getDoctors: (params = {}) =>
    BASE.get("/", { params }).then(res => res.data),

  getDoctorById: (id) =>
    BASE.get(`/${id}`).then(res => res.data),

  createDoctor: (data) =>
    BASE.post("/", data).then(res => res.data),

  updateDoctor: (id, data) =>
    BASE.put(`/${id}`, data).then(res => res.data),

  deleteDoctor: (id) =>
    BASE.delete(`/${id}`).then(res => res.data),

  // Upload photo
  uploadPhoto: (file) => {
    const fd = new FormData();
    fd.append("photo", file);

    return api.post("/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => res.data);
  }
};

export default doctorsService;