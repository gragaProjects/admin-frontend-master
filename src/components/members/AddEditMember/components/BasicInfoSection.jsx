import React, { useState } from 'react';
import Select from 'react-select';
import TextInput from '../shared/TextInput';
import membersService from '../../../../services/membersService';
import { FaTimes, FaPlus } from 'react-icons/fa';

const BasicInfoSection = ({ 
  formData, 
  setFormData, 
  isEditing, 
  parentMembers, 
  isLoadingParentMembers,
  onPincodeChange 
}) => {
  const [phoneInput, setPhoneInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle phone number formatting for both primary and secondary numbers
    if (name === 'phone' || name === 'secondaryPhone') {
      const formattedPhone = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneInputChange = (e) => {
    const formattedPhone = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneInput(formattedPhone);
  };

  const handleAddPhone = () => {
    if (phoneInput.length === 10 && !formData.additionalPhones?.includes(phoneInput)) {
      setFormData(prev => ({
        ...prev,
        additionalPhones: [...(prev.additionalPhones || []), phoneInput]
      }));
      setPhoneInput('');
    }
  };

  const handleRemovePhone = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalPhones: prev.additionalPhones.filter((_, i) => i !== index)
    }));
  };

  const handleSubProfileChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      isSubprofile: checked,
      primaryMemberId: checked ? prev.primaryMemberId : null
    }));
  };

  const handleParentMemberChange = async (selected) => {
    const selectedParentId = selected?.value || null;
    
    // Always update the primaryMemberId
    setFormData(prev => ({ 
      ...prev, 
      primaryMemberId: selectedParentId ? {
        _id: selectedParentId,
        name: selected.label.split(' (')[0],
        memberId: selected.label.split(' (')[1].replace(')', '')
      } : null,
      isSubprofile: Boolean(selectedParentId) // Set isSubprofile based on selection
    }));

    // If a parent is selected, fetch their complete details and pre-fill specific fields
    if (selectedParentId) {
      try {
        const response = await membersService.getMemberById(selectedParentId);
        
        if (response?.status === 'success' && response?.data) {
          const parentMember = response.data;
          const parentAddress = parentMember.address?.[0] || {};
          
          setFormData(prev => ({
            ...prev,
            // Keep the member's own name and ID
            name: prev.name,
            memberId: prev.memberId,
            // Update with parent's contact details
            email: parentMember.email || prev.email,
            phone: parentMember.phone?.replace('+91', '') || prev.phone,
            // Update address information
            address: {
              description: parentAddress.description || '',
              landmark: parentAddress.landmark || '',
              pinCode: parentAddress.pinCode || '',
              region: parentAddress.region || '',
              state: parentAddress.state || '',
              country: parentAddress.country || 'India',
              location: parentAddress.location || { latitude: null, longitude: null }
            },
            // Update emergency contact
            emergencyContact: {
              name: parentMember.emergencyContact?.name || '',
              relation: parentMember.emergencyContact?.relation || '',
              phone: parentMember.emergencyContact?.phone?.replace('+91', '') || ''
            }
          }));

          // If pincode exists, trigger the pincode change to update region options
          if (parentAddress.pinCode) {
            onPincodeChange({ target: { value: parentAddress.pinCode } });
          }
        }
      } catch (error) {
        console.error('Error fetching parent member details:', error);
      }
    } else {
      // If no parent selected (cleared), reset related fields but keep member's basic info
      setFormData(prev => ({
        ...prev,
        isSubprofile: false,
        primaryMemberId: null,
        // Reset address
        address: {
          description: '',
          landmark: '',
          pinCode: '',
          region: '',
          state: '',
          country: 'India',
          location: { latitude: null, longitude: null }
        },
        // Reset emergency contact
        emergencyContact: {
          name: '',
          relation: '',
          phone: ''
        }
      }));
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            required
          />
        </div>

        {/* Show Profile Type and Primary Member fields in both add and edit modes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Type
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isSubprofile}
                onChange={handleSubProfileChange}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">This is a subprofile</span>
            </label>
          </div>
        </div>

        {formData.isSubprofile && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Member *
            </label>
            <Select
              value={
                formData.primaryMemberId ? 
                  typeof formData.primaryMemberId === 'object' ?
                    {
                      value: formData.primaryMemberId._id,
                      label: `${formData.primaryMemberId.name} (${formData.primaryMemberId.memberId || formData.primaryMemberId._id})`
                    } :
                    parentMembers.find(option => option.value === formData.primaryMemberId)
                : null
              }
              onChange={handleParentMemberChange}
              options={parentMembers}
              isLoading={isLoadingParentMembers}
              isClearable
              placeholder="Search parent member..."
              className="react-select-container"
              classNamePrefix="react-select"
              noOptionsMessage={() => "No members found"}
              isDisabled={isLoadingParentMembers}
            />
          </div>
        )}

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
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
              +91
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength="10"
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit number"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Enter a 10-digit phone number</p>
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
            required
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
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height (in ft)
          </label>
          <input
            type="number"
            name="heightInFt"
            value={formData.heightInFt}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.1"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight (in kg)
          </label>
          <input
            type="number"
            name="weightInKg"
            value={formData.weightInKg}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.1"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection; 