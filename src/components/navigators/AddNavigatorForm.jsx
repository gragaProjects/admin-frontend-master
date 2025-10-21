import { useState, useEffect } from 'react'
import { FaTimes, FaUpload } from 'react-icons/fa'
import { navigatorsService } from '../../services/navigatorsService.js'
import { nursesService } from '../../services/nursesService.js'
import { getAllSchools } from '../../services/schoolsService'
import api from '../../services/api'
import { useSnackbar } from '../../contexts/SnackbarContext'

const AddNavigatorForm = ({ onClose, initialData, isEditing, activeTab = 'navigators', onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    dob: initialData?.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
    gender: initialData?.gender || '',
    languagesSpoken: initialData?.languagesSpoken || [],
    introduction: initialData?.introduction || '',
    profilePic: initialData?.profilePic || null,
    profilePicUrl: initialData?.profilePic || '',
    schoolId: initialData?.schoolId?._id || initialData?.schoolId || ''
  });

  // Track modified fields
  const [modifiedFields, setModifiedFields] = useState({});

  const [schools, setSchools] = useState([]);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoadingSchools(true);
        const response = await getAllSchools();
        if (response?.data) {
          setSchools(response.data);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
        showSnackbar('Failed to load schools', 'error');
      } finally {
        setIsLoadingSchools(false);
      }
    };

    if (activeTab === 'nurses') {
      fetchSchools();
    }
  }, [activeTab]);

  const languageOptions = [
    'Tamil', 'English', 'Hindi', 'Malayalam', 'Telugu', 'Kannada'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const initialValue = initialData?.[name];
    const isModified = value !== initialValue;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    setModifiedFields(prev => ({
      ...prev,
      [name]: isModified
    }));
    setError(null); // Clear error when user makes changes
  };

  const handleLanguageChange = (language) => {
    setFormData(prev => {
      const newLanguages = prev.languagesSpoken.includes(language)
        ? prev.languagesSpoken.filter(lang => lang !== language)
        : [...prev.languagesSpoken, language];
      
      // Check if languages have changed from initial data
      const isModified = JSON.stringify(newLanguages.sort()) !== JSON.stringify((initialData?.languagesSpoken || []).sort());
      
      setModifiedFields(prevFields => ({
        ...prevFields,
        languagesSpoken: isModified
      }));
      
      return {
        ...prev,
        languagesSpoken: newLanguages
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploadingImage(true);
        setError(null);

        // Create FormData object
        const formData = new FormData();
        formData.append('file', file);

        // Upload image
        const response = await api.post('/api/v1/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Upload response:', response);

        if (response?.success && response?.imageUrl) {
          setFormData(prev => ({
            ...prev,
            profilePic: file,
            profilePicUrl: response.imageUrl
          }));
          
          // Mark profile picture as modified
          setModifiedFields(prev => ({
            ...prev,
            profilePic: true
          }));
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        let errorMessage = 'Failed to upload image';
        
        if (err.response?.status === 413) {
          errorMessage = 'File size too large. Please upload a smaller image (max 10MB)';
        } else if (err.response?.status === 415) {
          errorMessage = 'Invalid file type. Please upload only images (PNG, JPG, GIF)';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handlePhoneChange = (e) => {
    // Only allow digits and limit to 10 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);

      // Client-side validation
      const validationErrors = [];
      
      if (!formData.name?.trim()) {
        validationErrors.push('Name is required');
      }
      
      // Email validation for both create and edit
      if (!formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        validationErrors.push('Please provide a valid email');
      }
      
      // Phone validation for both create and edit
      if (!formData.phone?.trim() || formData.phone.length !== 10) {
        validationErrors.push('Please provide a valid phone number');
      }
      
      if (!formData.gender || !['male', 'female', 'other'].includes(formData.gender.toLowerCase())) {
        validationErrors.push('Invalid gender');
      }

      if (!formData.languagesSpoken.length) {
        validationErrors.push('Please select at least one language');
      }

      if (!formData.introduction?.trim()) {
        validationErrors.push('Introduction is required');
      }

      if (!formData.dob) {
        validationErrors.push('Date of birth is required');
      }

      // Add school validation for nurses
      if (activeTab === 'nurses' && !formData.schoolId) {
        validationErrors.push('Please select a school');
      }

      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      // Prepare the data - for create, send all fields; for update, send only modified fields
      const submissionData = isEditing
        ? Object.keys(modifiedFields)
            .filter(key => modifiedFields[key])
            .reduce((acc, key) => {
              // Special handling for each field type
              if (key === 'name') acc[key] = formData[key].trim();
              else if (key === 'email') acc[key] = formData[key]?.trim();
              else if (key === 'gender') acc[key] = formData[key].toLowerCase();
              else if (key === 'introduction') acc[key] = formData[key].trim();
              else if (key === 'profilePic') acc[key] = formData.profilePicUrl || null;
              else acc[key] = formData[key];
              return acc;
            }, {})
        : {
            // For create, send all fields
        name: formData.name.trim(),
        email: formData.email?.trim(),
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender.toLowerCase(),
        languagesSpoken: formData.languagesSpoken,
        introduction: formData.introduction.trim(),
            profilePic: formData.profilePicUrl || null,
        schoolId: formData.schoolId
      };

      console.log('Submitting data:', submissionData);
      let response;
      
      // Check if we're dealing with a nurse based on both initialData and activeTab
      const isNurse = initialData?.role === 'nurse' || activeTab === 'nurses';
      
      if (isEditing) {
        if (isNurse) {
          response = await nursesService.updateNurse(initialData._id, submissionData);
        } else {
          response = await navigatorsService.updateNavigator(initialData._id, submissionData);
        }
      } else {
        if (isNurse) {
          response = await nursesService.createNurse(submissionData);
        } else {
          response = await navigatorsService.createNavigator(submissionData);
        }
      }

      console.log('API Response:', response);

      if (response?.status === 'success') {
        showSnackbar(`${isNurse ? 'Nurse' : 'Navigator'} ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
        if (onSuccess) {
          onSuccess(isNurse ? 'nurses' : 'navigators');
        }
        onClose();
      } else {
        throw new Error(response?.message || `Failed to ${isEditing ? 'update' : 'create'} ${isNurse ? 'nurse' : 'navigator'}`);
      }
    } catch (err) {
      console.error('Error details:', err);
      
      // Handle specific error types
      if (err.type === 'validation') {
        setError(err.message);
      } else if (err.type === 'auth') {
        showSnackbar(err.message, 'error');
        // Optionally redirect to login
      } else if (err.type === 'permission') {
        showSnackbar(err.message, 'error');
      } else {
        setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} ${isNurse ? 'nurse' : 'navigator'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update gender options to match API expectations
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold">
            {isEditing ? 'Edit' : 'Add New'} {activeTab === 'nurses' ? 'Nurse' : 'Navigator'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {isUploadingImage ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : formData.profilePicUrl ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={formData.profilePicUrl} 
                      alt="Profile" 
                      className="w-24 h-24 object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, profilePic: null, profilePicUrl: null }));
                        setModifiedFields(prev => ({ ...prev, profilePic: true }));
                      }}
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          name="profilePic"
                          onChange={handleFileChange}
                          className="sr-only"
                          accept="image/*"
                          disabled={isUploadingImage}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Add School Dropdown for Nurses */}
            {activeTab === 'nurses' && (
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
                  School *
                </label>
                <select
                  id="schoolId"
                  name="schoolId"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.schoolId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a school</option>
                  {schools && schools.map((school) => (
                    <option key={school._id} value={school._id}>
                      {school.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Languages */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages Spoken *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg">
              {languageOptions.map(language => (
                <label key={language} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.languagesSpoken.includes(language)}
                    onChange={() => handleLanguageChange(language)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Introduction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Introduction *
            </label>
            <textarea
              name="introduction"
              value={formData.introduction}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (isEditing ? 'Save Changes' : 'Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNavigatorForm; 