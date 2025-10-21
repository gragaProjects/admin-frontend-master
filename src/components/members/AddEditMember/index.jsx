import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import membersService from '../../../services/membersService';
import BasicInfoSection from './components/BasicInfoSection';
import PersonalHistorySection from './components/PersonalHistorySection';
import AddressSection from './components/AddressSection';
import EmergencyContactSection from './components/EmergencyContactSection';
import AdditionalInfoSection from './components/AdditionalInfoSection';
import ProfilePictureSection from './components/ProfilePictureSection';

const AddEditMember = ({ onClose, onSubmit, initialData = null, isEditing = false, mainMembers = [], onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const defaultFormData = {
    name: '',
    email: '',
    phone: '',
    secondaryPhone: '',
    additionalPhones: [],
    dob: '',
    gender: '',
    bloodGroup: '',
    heightInFt: '',
    weightInKg: '',
    employmentStatus: '',
    educationLevel: '',
    maritalStatus: '',
    additionalInfo: '',
    isSubprofile: false,
    primaryMemberId: null,
    profilePic: null,
    address: [{
      description: '',
      pinCode: '',
      region: '',
      landmark: '',
      state: '',
      country: 'India',
      location: { latitude: null, longitude: null }
    }],
    emergencyContact: {
      name: '',
      relation: '',
      phone: ''
    },
    subscriptions: [{
      planType: 'BASE_PLAN',
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      status: 'active'
    }],
    addons: [],
    active: true
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [regionOptions, setRegionOptions] = useState([]);
  const [isLoadingRegions, setIsLoadingRegions] = useState(false);
  const [parentMembers, setParentMembers] = useState([]);
  const [isLoadingParentMembers, setIsLoadingParentMembers] = useState(false);

  // Fetch parent members only once when component mounts and not in edit mode
  useEffect(() => {
    // Don't fetch parent members in edit mode
    if (isEditing) return;

    // Convert mainMembers to options format only if they exist and parentMembers is empty
    if (mainMembers.length > 0 && parentMembers.length === 0) {
      const memberOptions = mainMembers.map(member => ({
        value: member._id,
        label: `${member.name} (${member.memberId || member._id})`
      }));
      setParentMembers(memberOptions);
    } 
    // Only fetch if we don't have mainMembers and haven't fetched yet
    else if (mainMembers.length === 0 && parentMembers.length === 0) {
      fetchParentMembers();
    }
  }, [isEditing, mainMembers]); // Added isEditing to dependencies

  const fetchParentMembers = async () => {
    try {
      setIsLoadingParentMembers(true);
      const response = await membersService.getMembers({ 
        page: 1, 
        limit: 100,
        isSubprofile: false, // Only fetch main profiles
        active: true // Only fetch active members
      });
      
      if (response?.status === 'success' && Array.isArray(response.data)) {
        const memberOptions = response.data.map(member => ({
          value: member._id,
          label: `${member.name} (${member.memberId || member._id})`
        }));
        setParentMembers(memberOptions);
      } else {
        console.error('Invalid response structure:', response);
        showSnackbar('Failed to fetch parent members', 'error');
      }
    } catch (error) {
      console.error('Error fetching parent members:', error);
      showSnackbar('Failed to fetch parent members', 'error');
    } finally {
      setIsLoadingParentMembers(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      console.log('Formatting initial data for edit form:', initialData);
      const formattedData = {
        ...defaultFormData, // Start with default data
        ...initialData, // Spread initialData
        phone: initialData.phone?.replace('+91', '') || '',
        secondaryPhone: initialData.secondaryPhone?.replace('+91', '') || '',
        additionalPhones: initialData.additionalPhones?.map(phone => phone?.replace('+91', '')) || [],
        dob: initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
        // Handle address array with _id preservation for editing
        address: initialData.address?.length > 0 ? [
          {
            _id: initialData.address[0]._id, // Preserve the _id for updates
            description: initialData.address[0].description || '',
            pinCode: initialData.address[0].pinCode || '',
            region: initialData.address[0].region || '',
            landmark: initialData.address[0].landmark || '',
            state: initialData.address[0].state || '',
            country: initialData.address[0].country || 'India',
            location: initialData.address[0].location || { latitude: null, longitude: null }
          }
        ] : defaultFormData.address,
        emergencyContact: {
          name: initialData.emergencyContact?.name || '',
          relation: initialData.emergencyContact?.relation || '',
          phone: initialData.emergencyContact?.phone?.replace('+91', '') || ''
        }
      };

      console.log('Formatted data for form:', formattedData);
      setFormData(formattedData);

      // If there's a pincode, trigger the pincode change to update region options
      if (formattedData.address?.[0]?.pinCode) {
        handlePincodeChange({ target: { value: formattedData.address[0].pinCode } });
      }
    }
  }, [initialData]);

  // Add this useEffect to handle subprofile data when editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(prevData => ({
        ...prevData,
        isSubprofile: initialData.isSubprofile || false,
        primaryMemberId: initialData.primaryMemberId?._id || initialData.primaryMemberId || null
      }));
    }
  }, [isEditing, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log('AddEditMember: Starting form submission');
      // Start with basic data
      const submitData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        isSubprofile: formData.isSubprofile,
        profilePic: formData.profilePic === '' ? null : formData.profilePic,
        address: formData.address,
        subscriptions: formData.subscriptions,
        addons: formData.addons,
        active: formData.active,
        termsConditionsAccepted: true,
        onBoarded: true
      };

      // Only include primaryMemberId if it's a subprofile
      if (formData.isSubprofile && formData.primaryMemberId) {
        submitData.primaryMemberId = formData.primaryMemberId;
      }

      // Only include personal history fields if they have values
      if (formData.bloodGroup || formData.heightInFt || formData.weightInKg || 
          formData.employmentStatus || formData.educationLevel || formData.maritalStatus) {
        submitData.bloodGroup = formData.bloodGroup;
        submitData.heightInFt = formData.heightInFt;
        submitData.weightInKg = formData.weightInKg;
        submitData.employmentStatus = formData.employmentStatus;
        submitData.educationLevel = formData.educationLevel;
        submitData.maritalStatus = formData.maritalStatus;
      }

      // Only include emergency contact if any of its fields have values
      const hasEmergencyContact = formData.emergencyContact?.name || 
                                 formData.emergencyContact?.relation || 
                                 formData.emergencyContact?.phone;
      if (hasEmergencyContact) {
        submitData.emergencyContact = formData.emergencyContact;
      }

      // Only include additional info if it has a value
      if (formData.additionalInfo?.trim()) {
        submitData.additionalInfo = formData.additionalInfo;
      }

      // Only include secondary phone if it has a value
      if (formData.secondaryPhone?.trim()) {
        submitData.secondaryPhone = formData.secondaryPhone;
      }

      // Only include additional phones if array is not empty
      if (formData.additionalPhones?.length > 0) {
        submitData.additionalPhones = formData.additionalPhones;
      }

      // Handle empty profile picture
      if (submitData.profilePic === '') {
        submitData.profilePic = null;
      }

      if (!submitData.isSubprofile) {
        delete submitData.primaryMemberId;
      }

      // Add onboarding flag for new member creation
      if (!isEditing) {
        submitData.onBoarded = true;
      }

      // Format phone numbers with +91 prefix
      submitData.phone = submitData.phone ? (submitData.phone.startsWith('+91') ? submitData.phone : `+91${submitData.phone}`) : '';
      submitData.additionalPhones = submitData.additionalPhones?.map(phone => 
        phone ? (phone.startsWith('+91') ? phone : `+91${phone}`) : ''
      ).filter(phone => phone.trim() !== '') || [];
      submitData.emergencyContact = {
        ...submitData.emergencyContact,
        phone: submitData.emergencyContact?.phone ? 
          (submitData.emergencyContact.phone.startsWith('+91') ? 
            submitData.emergencyContact.phone : 
            `+91${submitData.emergencyContact.phone}`
          ) : ''
      };

      // Format address data
      const addressData = {
        description: Array.isArray(submitData.address) ? submitData.address[0].description : submitData.address.description || '',
        landmark: Array.isArray(submitData.address) ? submitData.address[0].landmark : submitData.address.landmark || '',
        pinCode: Array.isArray(submitData.address) ? submitData.address[0].pinCode : submitData.address.pinCode || '',
        region: Array.isArray(submitData.address) ? submitData.address[0].region : submitData.address.region || '',
        state: Array.isArray(submitData.address) ? submitData.address[0].state : submitData.address.state || '',
        country: Array.isArray(submitData.address) ? submitData.address[0].country : submitData.address.country || 'India',
        location: {
          latitude: null,
          longitude: null
        }
      };

      // For editing, keep the _id if it exists
      if (isEditing && Array.isArray(submitData.address) && submitData.address[0]._id) {
        addressData._id = submitData.address[0]._id;
      }

      submitData.address = addressData;

      // Validation
      const errors = validateFormData(submitData);
      if (errors.length > 0) {
        setError(errors.join('\n'));
        return;
      }

      let response;
      if (isEditing) {
        console.log('AddEditMember: Updating member...');
        const memberId = initialData._id || initialData.id;
        if (!memberId) {
          throw new Error('Member ID is required for update');
        }
        
        response = await membersService.updateMember(memberId, submitData);
        console.log('AddEditMember: Update response:', response);
      } else {
        console.log('AddEditMember: Creating new member...');
        response = await membersService.createMember(submitData);
        console.log('AddEditMember: Create response:', response);
      }

      if (response.status === 'success' && response.data) {
        showSnackbar(`Member ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
        
        // Close the modal first to prevent any state issues
        onClose();

        // Then trigger the callbacks
        if (onSubmit) {
          console.log('AddEditMember: Calling onSubmit');
          await onSubmit(response.data);
        }

        if (onSuccess) {
          console.log('AddEditMember: Calling onSuccess');
          await onSuccess();
        }
      } else {
        throw new Error(response.message || `Failed to ${isEditing ? 'update' : 'create'} member`);
      }
    } catch (error) {
      console.error('AddEditMember: Error:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.details?.join('\n')
        || error.message 
        || `Failed to ${isEditing ? 'update' : 'create'} member`;
      
      setError(errorMessage);
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateFormData = (data) => {
    const errors = [];
    const name = data.name?.trim();
    const email = data.email?.trim().toLowerCase();
    const phone = data.phone?.replace('+91', '').trim();
    const gender = data.gender?.toLowerCase();
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) errors.push('Name is required');
    if (!email || !emailRegex.test(email)) errors.push('Please provide a valid email');
    if (!phone || !phoneRegex.test(phone)) errors.push('Please provide a valid 10-digit phone number');
    if (!gender || !['male', 'female', 'other'].includes(gender)) errors.push('Invalid gender');
    if (!data.dob) errors.push('Date of birth is required');

    const emergencyContact = {
      name: data.emergencyContact?.name?.trim(),
      relation: data.emergencyContact?.relation?.trim(),
      phone: data.emergencyContact?.phone?.replace('+91', '').trim()
    };

    // Only validate emergency contact if any field is filled
    if (emergencyContact.name || emergencyContact.relation || emergencyContact.phone) {
      if (!emergencyContact.name) errors.push('Emergency contact name is required if other emergency contact fields are filled');
      if (!emergencyContact.relation) errors.push('Emergency contact relation is required if other emergency contact fields are filled');
      if (!emergencyContact.phone || !phoneRegex.test(emergencyContact.phone)) {
        errors.push('Please provide a valid 10-digit emergency contact phone number if other emergency contact fields are filled');
      }
    }

    if (data.isSubprofile && !data.primaryMemberId) {
      errors.push('Please select a parent member');
    }

    return errors;
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    
    // Update pincode in form data
    setFormData(prev => ({
      ...prev,
      address: prev.address.map(address => ({
        ...address,
        pinCode: pincode
      }))
    }));

    // Only fetch location details if pincode is 6 digits
    if (pincode.length === 6) {
      setIsLoadingRegions(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data[0].Status === 'Success') {
          const postOffices = data[0].PostOffice;
          
          // Set region options
          const options = postOffices.map(po => ({
            value: po.Name,
            label: po.Name
          }));
          setRegionOptions(options);
          
          // Auto-fill state only
          if (postOffices.length > 0 && !isEditing) {
            setFormData(prev => ({
              ...prev,
              address: prev.address.map(address => ({
                ...address,
                state: postOffices[0].State,
                country: 'India'
              }))
            }));
          }
        } else {
          showSnackbar('Invalid PIN code. Please check and try again.', 'error');
          setRegionOptions([]);
        }
      } catch (error) {
        console.error('Error fetching location details:', error);
        showSnackbar('Error fetching location details. Please try again.', 'error');
      } finally {
        setIsLoadingRegions(false);
      }
    } else {
      setRegionOptions([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Edit Member' : 'Add New Member'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <FaExclamationCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <ProfilePictureSection 
            formData={formData}
            setFormData={setFormData}
            isUploadingImage={isUploadingImage}
            setIsUploadingImage={setIsUploadingImage}
            setError={setError}
          />

          <BasicInfoSection 
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            parentMembers={parentMembers}
            isLoadingParentMembers={isLoadingParentMembers}
            onPincodeChange={handlePincodeChange}
          />

          <PersonalHistorySection 
            formData={formData}
            setFormData={setFormData}
          />

          <AddressSection 
            formData={formData}
            setFormData={setFormData}
            regionOptions={regionOptions}
            setRegionOptions={setRegionOptions}
            isLoadingRegions={isLoadingRegions}
            setIsLoadingRegions={setIsLoadingRegions}
          />

          <EmergencyContactSection 
            formData={formData}
            setFormData={setFormData}
          />

          <AdditionalInfoSection 
            formData={formData}
            setFormData={setFormData}
          />

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Add Member'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditMember; 