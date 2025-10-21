import React from 'react';
import Select from 'react-select';
import TextInput from '../shared/TextInput';

const emergencyContactRelations = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'spouse', label: 'Spouse' },
  { value: 'other', label: 'Other' },
  { value: 'son', label: 'Son' },
  { value: 'daughter', label: 'Daughter' }
];

const EmergencyContactSection = ({ formData = {}, setFormData }) => {
  // Ensure emergencyContact exists with default values
  const emergencyContact = formData.emergencyContact || {
    name: '',
    relation: '',
    phone: ''
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    
    // Handle phone number formatting
    if (name === 'phone') {
      const formattedPhone = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...(prev.emergencyContact || {}),
          phone: formattedPhone
        }
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...(prev.emergencyContact || {}),
        [name]: value
      }
    }));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-lg font-medium text-gray-700 mb-4">Emergency Contact</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TextInput
          label="Name"
          name="name"
          value={emergencyContact.name}
          onChange={handleEmergencyContactChange}
          placeholder="Emergency contact name"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relation
          </label>
          <Select
            value={emergencyContactRelations.find(option => option.value === emergencyContact.relation)}
            onChange={(selected) => setFormData(prev => ({
              ...prev,
              emergencyContact: {
                ...(prev.emergencyContact || {}),
                relation: selected?.value || ''
              }
            }))}
            options={emergencyContactRelations}
            placeholder="Select relation..."
            className="react-select-container"
            classNamePrefix="react-select"

          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
              +91
            </span>
            <input
              type="tel"
              name="phone"
              value={emergencyContact.phone}
              onChange={handleEmergencyContactChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

              maxLength="10"
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit number"
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Enter a 10-digit phone number</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactSection; 