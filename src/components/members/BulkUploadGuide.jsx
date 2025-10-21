import React, { useState } from 'react';
import { FaTimes, FaDownload, FaUpload, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import api from '../../services/api';

const BulkUploadGuide = ({ isOpen, onClose, onFileUpload, mode = 'insert' }) => {
  if (!isOpen) return null;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const getRequiredFields = () => {
    if (mode === 'insert') {
      return [
        { field: 'row_no', description: 'Serial number', example: '1' },
        { field: 'name', description: 'Full name of the member', example: 'Vikram Singh' },
        { field: 'phone', description: 'Phone number with country code', example: '+919876543226' }
      ];
    } else {
      return [
        { field: 'memberId', description: 'Unique member ID', example: 'MEM123' },
        { field: 'name', description: 'Full name of the member', example: 'Vikram Singh' },
        { field: 'phone', description: 'Phone number with country code', example: '+919876543226' }
      ];
    }
  };

  const requiredFields = getRequiredFields();

  const optionalFields = [
    { field: 'email', description: 'Email address', example: 'vikram.s@email.com' },
    { field: 'dob', description: 'Date of Birth (DD/MM/YYYY)', example: '12/08/1986' },
    { field: 'gender', description: 'Gender (male/female/other)', example: 'male' },
    { field: 'bloodGroup', description: 'Blood group', example: 'O+' },
    { field: 'heightInFt', description: 'Height in feet', example: '5.11' },
    { field: 'weightInKg', description: 'Weight in kilograms', example: '85' },
    { field: 'emergencyContact.name', description: 'Emergency contact name', example: 'Anita Singh' },
    { field: 'emergencyContact.relation', description: 'Relation (father/mother/guardian/spouse/other/son/daughter)', example: 'spouse' },
    { field: 'emergencyContact.phone', description: 'Emergency contact phone', example: '+919876543227' },
    { field: 'address.description', description: 'Address description', example: '145 Star Colony' },
    { field: 'address.landmark', description: 'Landmark', example: 'Near Garden' },
    { field: 'address.pinCode', description: 'PIN code', example: '560084' },
    { field: 'address.region', description: 'Region/Area', example: 'Marathahalli' },
    { field: 'address.city', description: 'City', example: 'Bangalore' },
    { field: 'address.state', description: 'State', example: 'Karnataka' },
    { field: 'address.country', description: 'Country', example: 'India' },
    { field: 'employmentStatus', description: 'Employment status (employed/unemployed/self_employed/retired/student/homemaker)', example: 'employed' },
    { field: 'educationLevel', description: 'Education level (primary/secondary/higher_secondary/graduate/post_graduate/doctorate)', example: 'graduate' },
    { field: 'maritalStatus', description: 'Marital status (single/married/divorced/widowed)', example: 'married' },
    { field: 'additionalInfo', description: 'Additional information', example: 'None' },
    { field: 'isStudent', description: 'Is student (TRUE/FALSE)', example: 'false' },
    { field: 'isSubprofile', description: 'Is subprofile (TRUE/FALSE)', example: 'false' }
  ];

  const downloadSampleCSV = () => {
    const headers = [...requiredFields, ...optionalFields].map(f => f.field).join(',');
    
    // Create two sample rows
    const sampleRow1 = [...requiredFields, ...optionalFields].map(f => f.example).join(',');
    const sampleRow2 = [
      '2',                    // row_no
      'Maya Reddy',          // name
      '+919876543228',       // phone
      'maya.r@email.com',    // email
      '1991-02-28',          // dob
      'female',              // gender
      'B+',                  // bloodGroup
      '5.4',                 // heightInFt
      '60',                  // weightInKg
      'Vikram Reddy',        // emergencyContact.name
      'spouse',              // emergencyContact.relation
      '+919876543229',       // emergencyContact.phone
      '67 Rose Villa',       // address.description
      'Near Lake',           // address.landmark
      '560011',             // address.pinCode
      'Bellandur',          // address.region
      'Bangalore',          // address.city
      'Karnataka',          // address.state
      'India',              // address.country
      'homemaker',          // employmentStatus
      'post_graduate',      // educationLevel
      'married',            // maritalStatus
      'None',               // additionalInfo
      'false',              // isStudent
      'false'               // isSubprofile
    ].join(',');

    const csv = `${headers}\n${sampleRow1}\n${sampleRow2}`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'insert' ? 'members_insert_template.csv' : 'members_update_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      await onFileUpload(file);
      onClose();
    } catch (error) {
      console.error('Error uploading members:', error);
      setError(error.message || 'Failed to upload members');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-7xl w-[95%] mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Bulk Upload Guide</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Important Note */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="text-yellow-500 mt-1" />
            <div>
              <h4 className="font-medium text-yellow-800">Important Note:</h4>
              <p className="text-yellow-700">
                Subprofiles cannot be added through bulk upload. To add subprofiles, please use the individual member addition process from the main members list.
              </p>
            </div>
          </div>
        </div>

        {/* Upload and Template Buttons */}
        <div className="flex gap-4 mb-6">
          <label className={`flex items-center gap-2 ${uploading ? 'bg-blue-400' : 'bg-blue-500'} text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}>
            <FaUpload />
            <span>{uploading ? 'Uploading...' : 'Upload CSV'}</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
          <button
            onClick={downloadSampleCSV}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            disabled={uploading}
          >
            <FaDownload />
            <span>Download Template</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Required Fields */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Required Fields</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/4">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Example</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requiredFields.map((field, index) => (
                    <tr key={field.field} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-normal">{field.field}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-normal">{field.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-normal">{field.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optional Fields */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Optional Fields</h3>
            <div className="bg-white border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/4">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Example</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {optionalFields.map((field, index) => (
                    <tr key={field.field} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-normal break-words">{field.field}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-normal break-words">{field.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-normal break-words">{field.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadGuide; 