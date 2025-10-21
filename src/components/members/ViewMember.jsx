import { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaEdit, FaUser, FaTrash, FaUserMd, FaUserClock } from 'react-icons/fa';
import membersService from '../../services/membersService';
import { useSnackbar } from '../../contexts/SnackbarContext';
import ConfirmationDialog from './common/ConfirmationDialog';
import AddEditMember from './AddEditMember';

const ViewMember = ({ memberId, member: initialMember, onClose, onEdit, onDelete }) => {
  const [member, setMember] = useState(initialMember);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Update member state when initialMember changes
    if (initialMember) {
      console.log('Member Data:', initialMember); // Debug log
      setMember(initialMember);
      setLoading(false);
      setError(null);
    }
  }, [initialMember]);

  // Enhanced helper function to safely render object values
  const renderValue = (value) => {
    if (value === null || value === undefined || value === '') return 'N/A';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (error) {
        return 'N/A';
      }
    }
    return String(value);
  };

  // Enhanced helper function to format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid Date';
      return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Helper function to safely get nested object properties
  const safeGet = (obj, path, defaultValue = 'N/A') => {
    if (!obj) return defaultValue;
    try {
      const keys = path.split('.');
      let result = obj;
      for (const key of keys) {
        if (result === null || result === undefined) return defaultValue;
        result = result[key];
      }
      return result !== null && result !== undefined ? result : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  // Helper function to safely render array values
  const renderArray = (array, separator = ', ') => {
    if (!Array.isArray(array) || array.length === 0) return 'N/A';
    try {
      return array.filter(item => item !== null && item !== undefined).join(separator);
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to safely render address
  const renderAddress = (address) => {
    if (!address) return 'N/A';
    
    const parts = [
      address.description,
      address.landmark,
      address.region,
      address.state,
      address.pinCode
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'N/A';
  };

  const handleDelete = () => {
    console.log('Delete button clicked'); // Debug log
    if (!memberId) {
      showSnackbar('Member ID is missing', 'error');
      return;
    }
    console.log('Setting showDeleteConfirm to true'); // Debug log
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    console.log('Delete confirmed'); // Debug log
    if (!memberId) {
      showSnackbar('Member ID is missing', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await membersService.deleteMember(memberId);
      
      if (response.status === 'success') {
        showSnackbar(response.message || 'Member deleted successfully', 'success');
        if (onDelete) {
          onDelete(memberId);
        }
        onClose();
      } else {
        throw new Error(response.message || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Error deleting member:', error);
      showSnackbar(error.message || 'Failed to delete member', 'error');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    console.log('ViewMember: Opening edit mode');
    setIsEditMode(true);
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      console.log('ViewMember: Edit submitted');
      
      // Update local state
      setMember(updatedData);
      setIsEditMode(false);
      
      // Call parent's onEdit callback to trigger list refresh
      if (onEdit) {
        console.log('ViewMember: Calling parent onEdit to refresh list');
        await onEdit(updatedData);
      }
      
      // Show success message
      showSnackbar('Member updated successfully', 'success');
    } catch (error) {
      console.error('ViewMember: Error in handleEditSubmit:', error);
      showSnackbar(error.message || 'Failed to update member', 'error');
    }
  };

  // Early return if no member data
  if (!member) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
          <div className="text-center text-gray-600">
            <p>No member data available</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {isEditMode ? (
            <div className="absolute inset-0 bg-white rounded-lg z-10">
              <div className="flex justify-between items-center mb-6 p-6 border-b">
                <h3 className="text-2xl font-semibold text-gray-800">Edit Member</h3>
                <button 
                  onClick={() => setIsEditMode(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="p-6">
                <AddEditMember
                  initialData={member}
                  isEditing={true}
                  onClose={() => setIsEditMode(false)}
                  onSubmit={handleEditSubmit}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Member Details</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                    title="Edit Member"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50"
                    title="Delete Member"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-50"
                    title="Close"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                    {safeGet(member, 'profilePic') ? (
                      <img
                        src={safeGet(member, 'profilePic')}
                        alt={safeGet(member, 'name', 'Member')}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <FaUser className="w-12 h-12 text-gray-400" style={{ display: safeGet(member, 'profilePic') ? 'none' : 'flex' }} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold">{safeGet(member, 'name')}</h4>
                    <p className="text-gray-600">Member ID: {safeGet(member, 'memberId')}</p>
                    <p className="text-gray-600">{safeGet(member, 'email')}</p>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{safeGet(member, 'phone')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">{formatDate(safeGet(member, 'dob'))}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium capitalize">{safeGet(member, 'gender')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium">{safeGet(member, 'bloodGroup')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-medium">
                        {safeGet(member, 'heightInFt') ? `${safeGet(member, 'heightInFt')} ft` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-medium">
                        {safeGet(member, 'weightInKg') ? `${safeGet(member, 'weightInKg')} kg` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Employment Status</p>
                      <p className="font-medium capitalize">{safeGet(member, 'employmentStatus')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Education Level</p>
                      <p className="font-medium capitalize">{safeGet(member, 'educationLevel')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Marital Status</p>
                      <p className="font-medium capitalize">{safeGet(member, 'maritalStatus')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Additional Information</p>
                      <p className="font-medium">{safeGet(member, 'additionalInfo')}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Healthcare Team */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Assigned Navigator */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <FaUserClock className="w-5 h-5 text-blue-500" />
                      <h4 className="text-lg font-medium text-gray-900">Navigator</h4>
                    </div>
                    {safeGet(member, 'healthcareTeam.navigator') ? (
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-50 flex items-center justify-center border border-blue-100">
                          {safeGet(member, 'healthcareTeam.navigator._id.profilePic') ? (
                            <img 
                              src={safeGet(member, 'healthcareTeam.navigator._id.profilePic')}
                              alt={safeGet(member, 'healthcareTeam.navigator._id.name', 'Navigator')}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <FaUserClock className="w-8 h-8 text-blue-400" style={{ display: safeGet(member, 'healthcareTeam.navigator._id.profilePic') ? 'none' : 'flex' }} />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {safeGet(member, 'healthcareTeam.navigator._id.name')}
                          </h5>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              ID: {safeGet(member, 'healthcareTeam.navigator._id.navigatorId')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {safeGet(member, 'healthcareTeam.navigator._id.email', 'No email provided')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {safeGet(member, 'healthcareTeam.navigator._id.phone', 'No phone provided')}
                            </p>
                            <p className="text-xs text-gray-400">
                              Assigned: {formatDate(safeGet(member, 'healthcareTeam.navigator.assignedDate'))}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <FaUserClock className="w-4 h-4 opacity-50" />
                        <p>No navigator assigned</p>
                      </div>
                    )}
                  </div>

                  {/* Assigned Doctor */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <FaUserMd className="w-5 h-5 text-green-500" />
                      <h4 className="text-lg font-medium text-gray-900">Doctor</h4>
                    </div>
                    {safeGet(member, 'healthcareTeam.doctor') ? (
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-green-50 flex items-center justify-center border border-green-100">
                          {safeGet(member, 'healthcareTeam.doctor._id.profilePic') ? (
                            <img 
                              src={safeGet(member, 'healthcareTeam.doctor._id.profilePic')}
                              alt={safeGet(member, 'healthcareTeam.doctor._id.name', 'Doctor')}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <FaUserMd className="w-8 h-8 text-green-400" style={{ display: safeGet(member, 'healthcareTeam.doctor._id.profilePic') ? 'none' : 'flex' }} />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {safeGet(member, 'healthcareTeam.doctor._id.name')}
                          </h5>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              ID: {safeGet(member, 'healthcareTeam.doctor._id.doctorId')}
                            </p>
                            {safeGet(member, 'healthcareTeam.doctor._id.qualification') && (
                              <p className="text-sm text-gray-600">
                                {renderArray(safeGet(member, 'healthcareTeam.doctor._id.qualification'))}
                              </p>
                            )}
                            <p className="text-sm text-gray-500">
                              {safeGet(member, 'healthcareTeam.doctor._id.email', 'No email provided')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {safeGet(member, 'healthcareTeam.doctor._id.phone', 'No phone provided')}
                            </p>
                            <p className="text-xs text-gray-400">
                              Assigned: {formatDate(safeGet(member, 'healthcareTeam.doctor.assignedDate'))}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-gray-500">
                        <FaUserMd className="w-4 h-4 opacity-50" />
                        <p>No doctor assigned</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Address Information</h4>
                  {safeGet(member, 'address') && Array.isArray(safeGet(member, 'address')) && safeGet(member, 'address').length > 0 ? (
                    <div className="space-y-4">
                      {safeGet(member, 'address').map((addr, index) => (
                        <div key={addr?._id || index} className={`${index > 0 ? 'border-t pt-4' : ''}`}>
                          {index > 0 && <p className="text-sm text-gray-500 mb-2">Additional Address {index + 1}</p>}
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <div className="flex-grow">
                                <p className="font-medium text-gray-900">{safeGet(addr, 'description')}</p>
                                {safeGet(addr, 'landmark') && (
                                  <p className="text-gray-600 text-sm">
                                    Landmark: {safeGet(addr, 'landmark')}
                                  </p>
                                )}
                                <p className="text-gray-600">
                                  {renderAddress(addr)}
                                </p>
                                <p className="text-gray-600">{safeGet(addr, 'country')}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No address information available</p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{safeGet(member, 'emergencyContact.name')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Relation</p>
                      <p className="font-medium capitalize">{safeGet(member, 'emergencyContact.relation')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{safeGet(member, 'emergencyContact.phone')}</p>
                    </div>
                  </div>
                </div>

                {/* Membership Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-6">Membership Information</h4>
                  
                  {/* Premium Membership Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900">Premium Membership</h5>
                        <p className={`mt-1 ${safeGet(member, 'membershipStatus.premiumMembership.isActive') ? 'text-green-600' : 'text-gray-500'}`}>
                          {safeGet(member, 'membershipStatus.premiumMembership.isActive') ? '● Active' : '○ Inactive'}
                        </p>
                      </div>
                      {safeGet(member, 'membershipStatus.premiumMembership.isActive') && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Renewals</p>
                          <p className="text-xl font-semibold text-blue-600">{safeGet(member, 'membershipStatus.premiumMembership.renewalCount', 0)}</p>
                        </div>
                      )}
                    </div>
                    {safeGet(member, 'membershipStatus.premiumMembership.isActive') && (
                      <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="font-medium">{formatDate(safeGet(member, 'membershipStatus.premiumMembership.startDate'))}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expiry Date</p>
                          <p className="font-medium">{formatDate(safeGet(member, 'membershipStatus.premiumMembership.expiryDate'))}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Registration and Status Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500">Registration Status</p>
                        <div className="mt-1">
                          <p className={`font-medium ${safeGet(member, 'membershipStatus.isRegistered') ? 'text-green-600' : 'text-gray-600'}`}>
                            {safeGet(member, 'membershipStatus.isRegistered') ? '● Registered' : '○ Not Registered'}
                          </p>
                          {safeGet(member, 'membershipStatus.isRegistered') && (
                            <p className="text-sm text-gray-500 mt-1">
                              Since {formatDate(safeGet(member, 'membershipStatus.registrationDate'))}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500">Registration Discount</p>
                        <p className={`mt-1 font-medium ${safeGet(member, 'membershipStatus.hasOneTimeRegistrationDiscount') ? 'text-green-600' : 'text-gray-600'}`}>
                          {safeGet(member, 'membershipStatus.hasOneTimeRegistrationDiscount') ? '● Available' : '○ Not Available'}
                        </p>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500">Profile Information</p>
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Type</span>
                            <span className="font-medium">{safeGet(member, 'isSubprofile') ? 'Sub Profile' : 'Main Profile'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Category</span>
                            <span className="font-medium">{safeGet(member, 'isStudent') ? 'Student' : 'Regular'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Status</span>
                            <span className={`font-medium ${safeGet(member, 'active') ? 'text-green-600' : 'text-red-600'}`}>
                              {safeGet(member, 'active') ? '● Active' : '○ Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subprofile Information - Only show if this is a subprofile */}
                {safeGet(member, 'isSubprofile') && safeGet(member, 'primaryMemberId') && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-4">
                      <FaUser className="w-5 h-5 text-purple-500" />
                      <h4 className="text-lg font-medium text-gray-900">Primary Member Details</h4>
                    </div>
                    <div className="space-y-3">
                      {safeGet(member, 'primaryMemberId') && typeof safeGet(member, 'primaryMemberId') === 'object' ? (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{safeGet(member, 'primaryMemberId.name')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Member ID</p>
                            <p className="font-medium">{safeGet(member, 'primaryMemberId.memberId') || safeGet(member, 'primaryMemberId._id')}</p>
                          </div>
                          {safeGet(member, 'relation') && (
                            <div>
                              <p className="text-sm text-gray-500">Relationship</p>
                              <p className="font-medium capitalize">{safeGet(member, 'relation')}</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500">Primary member details not available</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60]">
          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            title="Delete Member"
            message="Are you sure you want to delete this member? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteConfirm(false)}
            variant="danger"
          />
        </div>
      )}
    </>
  );
};

export default ViewMember; 
