import api from './api';

export const membersService = {
  getMembers: async (params = {}) => {
    try {
      // Build query string for pagination, search and filters
      const queryParams = new URLSearchParams();
      
      // Required params
      queryParams.append('isStudent', params.isStudent === true);
      queryParams.append('sortBy', params.sortBy || 'createdAt');
      queryParams.append('sortOrder', params.sortOrder || 'asc');
      queryParams.append('page', params.page || 1);
      queryParams.append('limit', params.limit || 10);
      
      // Optional filter params - only append if they have values
      if (params.search) queryParams.append('search', params.search);
      if (params.navigatorId) queryParams.append('navigatorId', params.navigatorId);
      if (params.doctorId) queryParams.append('doctorId', params.doctorId);
      if (params.nurseId) queryParams.append('nurseId', params.nurseId);
      if (params.schoolId) queryParams.append('schoolId', params.schoolId);
      if (params.grade) queryParams.append('grade', params.grade);
      if (params.section) queryParams.append('section', params.section);
      if (params.isSubprofile !== undefined) queryParams.append('isSubprofile', params.isSubprofile);
      if (params.includeSubprofiles !== undefined) queryParams.append('includeSubprofiles', params.includeSubprofiles);
      if (params.maritalStatus) queryParams.append('maritalStatus', params.maritalStatus);
      if (params.educationLevel) queryParams.append('educationLevel', params.educationLevel);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.primaryMemberId) queryParams.append('primaryMemberId', params.primaryMemberId);
      
      const url = `/api/v1/members?${queryParams.toString()}`;
      console.log('Fetching members with URL:', url);
      
      const response = await api.get(url);

      // Ensure response has the correct structure
      if (response?.status === 'success') {
        // Remove membershipCard field from each member in the response
        const modifiedData = response.data?.map(member => {
          const { membershipCard, ...memberWithoutCard } = member;
          return memberWithoutCard;
        }) || [];

        return {
          status: 'success',
          data: modifiedData,
          pagination: response.pagination || {
            total: 0,
            page: 1,
            pages: 1
          }
        };
      }

      throw new Error(response?.message || 'Failed to fetch members');
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  getMemberById: async (id) => {
    try {
      if (!id) {
        throw new Error('Member ID is required');
      }

      console.log('Fetching member with ID:', id);
      const response = await api.get(`/api/v1/members/${id}`);
      
      console.log('Raw API response:', response);

      // Check if response exists and has data
      if (response?.status === 'success' && response?.data) {
        // Remove membershipCard field from the response
        const { membershipCard, ...memberDataWithoutCard } = response.data;

        // Transform profilePic field if it's "null"
        const memberData = {
          ...memberDataWithoutCard,
          profilePic: memberDataWithoutCard.profilePic === "null" ? null : memberDataWithoutCard.profilePic,
          // Ensure student-specific fields are present
          memberId: memberDataWithoutCard.memberId || memberDataWithoutCard._id,
          educationLevel: memberDataWithoutCard.educationLevel || null,
          section: memberDataWithoutCard.section || null,
          schoolId: memberDataWithoutCard.schoolId || null
        };

        return {
          status: 'success',
          data: memberData
        };
      }

      throw new Error('No data received from API');
    } catch (error) {
      console.error('Error fetching member by ID:', error);
      throw {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Failed to fetch member details',
        error: error
      };
    }
  },

  createMember: async (data) => {
    try {
      console.log('Creating member with data:', data);

      // Format the request data
      const requestData = {
        ...data,
        // Ensure phone numbers have +91 prefix
        phone: data.phone?.startsWith('+91') ? data.phone : `+91${data.phone?.replace(/\D/g, '')}`,
        secondaryPhone: data.secondaryPhone ? (data.secondaryPhone.startsWith('+91') ? data.secondaryPhone : `+91${data.secondaryPhone.replace(/\D/g, '')}`) : null,
        // Only include emergencyContact if it exists
        emergencyContact: data.emergencyContact ? {
          ...data.emergencyContact,
          phone: data.emergencyContact.phone?.startsWith('+91') 
            ? data.emergencyContact.phone 
            : `+91${data.emergencyContact.phone?.replace(/\D/g, '')}`
        } : undefined,
        // Ensure address has location object
        address: {
          ...data.address,
          location: {
            latitude: null,
            longitude: null
          }
        },
        // Use the profilePic URL directly
        profilePic: data.profilePic || null,
        isStudent: data.isStudent || false,
        isSubprofile: data.isSubprofile,
        subprofileIds: [],
        active: true
      };

      console.log('Formatted request data:', requestData);

      // Send the request
      const response = await api.post('/api/v1/members', requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Create member response:', response);

      if (response.status === 'success' && response.data) {
        // Transform profilePic field if it's "null"
        response.data = {
          ...response.data,
          profilePic: response.data.profilePic === "null" ? null : response.data.profilePic
        };
        return response;
      } else {
        throw new Error(response.message || 'Failed to create member');
      }
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  },

  updateMember: async (id, formData) => {
    try {
      console.log('Updating member with ID:', id);
      console.log('Update data:', formData);

      let submitData;
      let headers = {};

      if (formData instanceof FormData) {
        // Parse and clean the JSON data from FormData
        const jsonData = JSON.parse(formData.get('data'));
        console.log('Original JSON data:', jsonData);

        // Clean and format the data
        submitData = {
          ...jsonData,
          _id: id,
          // Only include phone if it's different from the current value
          phone: jsonData.phone !== formData.currentPhone ? 
            (jsonData.phone?.startsWith('+91') ? jsonData.phone : `+91${jsonData.phone}`) : 
            undefined,
          // Only include secondaryPhone if it's different from the current value
          secondaryPhone: jsonData.secondaryPhone !== formData.currentSecondaryPhone ?
            (jsonData.secondaryPhone ? (jsonData.secondaryPhone.startsWith('+91') ? jsonData.secondaryPhone : `+91${jsonData.secondaryPhone}`) : null) :
            undefined,
          // Only include email if it's different from the current value
          email: jsonData.email !== formData.currentEmail ? jsonData.email : undefined,
          emergencyContact: {
            ...jsonData.emergencyContact,
            // Only include emergency contact phone if it's different
            phone: jsonData.emergencyContact?.phone !== formData.currentEmergencyPhone ?
              (jsonData.emergencyContact?.phone?.startsWith('+91') 
                ? jsonData.emergencyContact.phone 
                : `+91${jsonData.emergencyContact.phone}`) : 
              undefined
          },
          address: {
            ...jsonData.address,
            location: {
              latitude: null,
              longitude: null
            }
          },
          profilePic: jsonData.profilePic || null
        };

        // Create a new FormData instance
        const cleanedFormData = new FormData();
        
        // Add the cleaned JSON data
        cleanedFormData.append('data', JSON.stringify(submitData));
        
        // Add the profile picture if it exists
        if (formData.has('profilePic')) {
          cleanedFormData.append('profilePic', formData.get('profilePic'));
        }
        
        submitData = cleanedFormData;
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        submitData = {
          ...formData,
          _id: id,
          // Only include phone if it's different from the current value
          phone: formData.phone !== formData.currentPhone ? 
            (formData.phone?.startsWith('+91') ? formData.phone : `+91${formData.phone}`) : 
            undefined,
          // Only include secondaryPhone if it's different from the current value
          secondaryPhone: formData.secondaryPhone !== formData.currentSecondaryPhone ?
            (formData.secondaryPhone ? (formData.secondaryPhone.startsWith('+91') ? formData.secondaryPhone : `+91${formData.secondaryPhone}`) : null) :
            undefined,
          // Only include email if it's different from the current value
          email: formData.email !== formData.currentEmail ? formData.email : undefined,
          emergencyContact: {
            ...formData.emergencyContact,
            // Only include emergency contact phone if it's different
            phone: formData.emergencyContact?.phone !== formData.currentEmergencyPhone ?
              (formData.emergencyContact?.phone?.startsWith('+91') 
                ? formData.emergencyContact.phone 
                : `+91${formData.emergencyContact.phone}`) : 
              undefined
          },
          address: {
            ...formData.address,
            location: {
              latitude: null,
              longitude: null
            }
          },
          profilePic: formData.profilePic || null
        };
        headers['Content-Type'] = 'application/json';
      }

      console.log('Submitting update data:', submitData);
      const response = await api.put(`/api/v1/members/${id}`, submitData, { headers });
      console.log('Update member response:', response);

      // Transform profilePic field if it's "null"
      if (response.data) {
        response.data = {
          ...response.data,
          profilePic: response.data.profilePic === "null" ? null : response.data.profilePic
        };
      }

      return response;
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  },

  deleteMember: async (id) => {
    try {
      console.log('Deleting member with ID:', id);
      
      const response = await api.delete(`/api/v1/members/${id}`);
      console.log('Delete member response:', response);

      // Check if the response has the expected format
      if (response && response.status === 'success') {
        return {
          status: 'success',
          message: response.message || 'Member deleted successfully'
        };
      } else {
        throw new Error(response?.message || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      throw {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Failed to delete member'
      };
    }
  },

  assignNavigator: async (memberIds, navigatorId) => {
    try {
      console.log('Assigning navigator to members:', { memberIds, navigatorId });
      const response = await api.patch('/api/v1/members/assign/navigator', {
        memberIds,
        navigatorId
      });
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to assign navigator');
      }
    } catch (error) {
      console.error('Error assigning navigator:', error);
      throw error;
    }
  },

  assignDoctor: async (memberIds, doctorId) => {
    try {
      console.log('Assigning doctor to members:', { memberIds, doctorId });
      const response = await api.patch('/api/v1/members/assign/doctor', {
        memberIds,
        doctorId
      });
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to assign doctor');
      }
    } catch (error) {
      console.error('Error assigning doctor:', error);
      throw error;
    }
  },

  assignNurse: async (memberIds, nurseId) => {
    try {
      console.log('Assigning nurse to members:', { memberIds, nurseId });
      const response = await api.patch('/api/v1/members/assign/nurse', {
        memberIds,
        nurseId
      });
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to assign nurse');
      }
    } catch (error) {
      console.error('Error assigning nurse:', error);
      throw error;
    }
  },

  bulkUpload: async (formData) => {
    try {
      console.log('Uploading members in bulk');
      const response = await api.post('/api/v1/members/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to upload members');
      }
    } catch (error) {
      console.error('Error uploading members:', error);
      throw error;
    }
  },

  bulkUploadStudents: async (formData) => {
    try {
      const response = await api.post('/api/v1/members/bulk-upload-students', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error in bulkUploadStudents:', error);
      throw error.response?.data || error;
    }
  },

  uploadFile: async (formData) => {
    try {
      const response = await api.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.status === 'success' && response?.data) {
        return response;
      }

      throw new Error(response?.message || 'Failed to upload file');
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  renewMembership: async (memberId) => {
    try {
      console.log('Renewing membership for member:', memberId);
      const response = await api.patch(`/api/v1/members/${memberId}/membership/renewal`);
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to renew membership');
      }
    } catch (error) {
      console.error('Error renewing membership:', error);
      throw error;
    }
  },

  getMemberSubscriptions: async (memberId) => {
    try {
      console.log('Fetching subscriptions for member:', memberId);
      const response = await api.get(`/api/v1/members/${memberId}/subscriptions`);
      
      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to fetch subscriptions');
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

  addPackageSubscription: async (memberId, packageId, packageDetails) => {
    try {
      // Validate inputs
      if (!memberId) throw new Error('Member ID is required');
      if (!packageId) throw new Error('Package ID is required');

      console.log('Adding package subscription:', { memberId, packageId, packageDetails });
      
      // Calculate plan duration in months from days
      const planDuration = Math.ceil(packageDetails.durationInDays / 30);
      
      const response = await api.patch(`/api/v1/members/${memberId}/subscriptions`, {
        packageId,
      });
      
      console.log('Package subscription response:', response);

      if (response.status === 'success') {
        return response;
      } else {
        throw new Error(response.message || 'Failed to add package subscription');
      }
    } catch (error) {
      console.error('Error adding package subscription:', error);
      // Preserve the original error structure from the API
      if (error.response?.data) {
        throw error.response.data;
      }
      throw {
        status: 'error',
        message: error.message || 'Failed to add package subscription'
      };
    }
  },

  getMembershipCard: async (memberId) => {
    try {
      if (!memberId) {
        throw new Error('Member ID is required');
      }

      console.log('Fetching membership card for member:', memberId);
      const response = await api.get(`/api/v1/members/${memberId}/membership-card`);
      
      if (response?.status === 'success' && response?.data?.s3Url) {
        return {
          status: 'success',
          data: response.data
        };
      }

      throw new Error(response?.data?.message || 'Failed to fetch membership card');
    } catch (error) {
      console.error('Error fetching membership card:', error);
      throw {
        status: 'error',
        message: error.response?.data?.message || error.message || 'Failed to fetch membership card',
        error: error
      };
    }
  }
};

export default membersService; 