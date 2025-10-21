import { useState, useEffect, useRef } from 'react'
import { FaUserCircle, FaPhone, FaEnvelope, FaUserMd, FaTrash, FaEdit, FaTimes, FaSearch, FaDownload } from 'react-icons/fa'
import ConfirmationDialog from './ConfirmationDialog'
import AddNavigatorForm from './AddNavigatorForm'
import { navigatorsService } from '../../services/navigatorsService.js'
import { nursesService } from '../../services/nursesService'
import { useSnackbar } from '../../contexts/SnackbarContext'
import html2canvas from 'html2canvas'

const NavigatorDetail = ({ navigator: initialNavigator, onClose, onDelete, onSuccess }) => {
  const { showSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [navigator, setNavigator] = useState(initialNavigator)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNavigatorDropdown, setShowNavigatorDropdown] = useState(false)
  const [navigatorsList, setNavigatorsList] = useState([])
  const [navigatorSearch, setNavigatorSearch] = useState('')
  const [isLoadingNavigators, setIsLoadingNavigators] = useState(false)
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchNavigatorDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Determine if we're dealing with a nurse or navigator
        const isNurse = initialNavigator.role === 'nurse'
        const service = isNurse ? nursesService : navigatorsService
        const response = await service[isNurse ? 'getNurseById' : 'getNavigatorById'](initialNavigator._id)
        
        if (response?.status === 'success' && response?.data) {
          // Format the data consistently
          const formattedData = {
            ...response.data,
            role: isNurse ? 'nurse' : 'navigator',
            total_assigned_members: response.data.total_assigned_members || 0,
            rating: response.data.rating || 0,
            profilePic: response.data.profilePic || null,
            introduction: response.data.introduction || 'No introduction available',
            languagesSpoken: response.data.languagesSpoken || [],
            name: response.data.name || initialNavigator.name,
            email: response.data.email || initialNavigator.email,
            phone: response.data.phone || initialNavigator.phone,
            gender: response.data.gender || initialNavigator.gender,
            // Add new fields
            nurseId: response.data.nurseId || 'N/A',
            schoolAssigned: response.data.schoolAssigned || false,
            schoolId: response.data.schoolId || null
          }
          setNavigator(formattedData)
        } else {
          // Fallback to initial data if API call fails
          setNavigator({
            ...initialNavigator,
            introduction: initialNavigator.introduction || 'No introduction available',
            languagesSpoken: initialNavigator.languagesSpoken || []
          })
        }
      } catch (err) {
        console.error(`Error fetching ${initialNavigator.role} details:`, err)
        setError(`Failed to fetch ${initialNavigator.role} details. Please try again later.`)
        // Fallback to initial data
        setNavigator(initialNavigator)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNavigatorDetails()
  }, [initialNavigator])

  const handleDelete = async () => {
    try {
      const isNurse = navigator.role === 'nurse';
      const service = isNurse ? nursesService : navigatorsService;
      const response = await service[isNurse ? 'deleteNurse' : 'deleteNavigator'](navigator._id);
      
      if (response?.status === 'success') {
        setShowDeleteConfirm(false);
        showSnackbar(`${navigator.role.charAt(0).toUpperCase() + navigator.role.slice(1)} deleted successfully!`, 'success');
        onDelete(navigator._id);
        onClose();
        window.location.reload();
      } else {
        throw new Error(response?.message || `Failed to delete ${navigator.role}`);
      }
    } catch (err) {
      console.error('Error deleting navigator:', err);
      showSnackbar(err.message || `Failed to delete ${navigator.role}`, 'error');
    }
  };

  const fetchNavigators = async (searchQuery = '') => {
    try {
      setIsLoadingNavigators(true);
      const response = await navigatorsService.getNavigators({ search: searchQuery });
      if (response?.status === 'success' && response?.data) {
        setNavigatorsList(response.data);
      }
    } catch (err) {
      console.error('Error fetching navigators:', err);
      showSnackbar('Failed to fetch navigators', 'error');
    } finally {
      setIsLoadingNavigators(false);
    }
  };

  const handleAssignNavigator = async (selectedNavigator) => {
    try {
      const response = await nursesService.assignNavigator({
        navigatorId: selectedNavigator._id,
        nurseId: navigator._id
      });
      
      if (response?.status === 'success') {
        showSnackbar('Navigator assigned successfully', 'success');
        setNavigator(prev => ({
          ...prev,
          navigatorAssigned: true,
          navigatorId: {
            _id: selectedNavigator._id,
            name: selectedNavigator.name,
            profilePic: selectedNavigator.profilePic,
            navigatorId: selectedNavigator.navigatorId
          }
        }));
        setShowNavigatorDropdown(false);
      } else {
        throw new Error(response?.message || 'Failed to assign navigator');
      }
    } catch (err) {
      console.error('Error assigning navigator:', err);
      showSnackbar(err.message || 'Failed to assign navigator', 'error');
    }
  };

  // Add useEffect for searching navigators
  useEffect(() => {
    if (showNavigatorDropdown) {
      const delayDebounceFn = setTimeout(() => {
        fetchNavigators(navigatorSearch);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [navigatorSearch, showNavigatorDropdown]);

  const handleDownload = async () => {
    try {
      const isNurse = navigator.role === 'nurse';
      const service = isNurse ? nursesService : navigatorsService;
      const response = await service[isNurse ? 'getNurseProfilePdf' : 'getNavigatorProfilePdf'](navigator._id);
      
      if (response?.s3Url) {
        // Open the PDF in a new tab
        window.open(response.s3Url, '_blank');
      } else {
        throw new Error('Failed to generate profile PDF');
      }
    } catch (error) {
      console.error('Error generating profile PDF:', error);
      showSnackbar(error.message || 'Failed to generate profile PDF', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Error</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">
            {navigator.role === 'nurse' ? 'Nurse' : 'Navigator'} Profile
          </h3>
          <div className="flex gap-2">
            {/* <button 
              onClick={handleDownload}
              className="p-2 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
              title="Download Profile PDF"
            >
              <FaDownload className="w-5 h-5" />
            </button> */}
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
              title={`Delete ${navigator.role === 'nurse' ? 'Nurse' : 'Navigator'}`}
            >
              <FaTrash className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-blue-50 rounded-full text-blue-500 transition-colors"
              title={`Edit ${navigator.role === 'nurse' ? 'Nurse' : 'Navigator'}`}
            >
              <FaEdit className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              title="Close"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div ref={profileRef} className="bg-white">
          <div className="flex flex-col items-center md:flex-row md:items-start gap-8">
            <div className="flex flex-col items-center">
              {navigator.profilePic ? (
                <img 
                  src={navigator.profilePic} 
                  alt={navigator.name}
                  className="w-40 h-40 rounded-full object-cover shadow-lg"
                />
              ) : (
                <FaUserCircle className="w-40 h-40 text-gray-400" />
              )}
              <div className="mt-4 text-center">
                <h4 className="text-2xl font-semibold text-gray-800">{navigator.name}</h4>
                <p className="text-gray-600">{navigator.role.charAt(0).toUpperCase() + navigator.role.slice(1)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {navigator.role === 'nurse' ? navigator.nurseId : navigator.navigatorId || 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h5>
                <div className="space-y-3">
                  <p className="flex items-center gap-3 text-gray-600">
                    <FaPhone className="text-blue-500" />
                    {navigator.phone}
                  </p>
                  <p className="flex items-center gap-3 text-gray-600">
                    <FaEnvelope className="text-blue-500" />
                    {navigator.email}
                  </p>
                  <p className="flex items-center gap-3 text-gray-600">
                    <FaUserMd className="text-blue-500" />
                    <span className="capitalize">{navigator.gender}</span>
                  </p>
                </div>
              </div>

              {/* School Information for nurses */}
              {navigator.role === 'nurse' && navigator.schoolId && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">School Information</h5>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      <span className="font-medium">School Name:</span> {navigator.schoolId.name}
                    </p>
                   
                  </div>
                </div>
              )}

              {/* Languages Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">Languages Spoken</h5>
                <div className="flex flex-wrap gap-2">
                  {navigator.languagesSpoken?.map((language, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bio Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-4">About</h5>
                <p className="text-gray-600 leading-relaxed">{navigator.introduction}</p>
              </div>

              {/* Statistics - Only show for navigators */}
              {navigator.role !== 'nurse' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-blue-600 text-sm font-medium">Total Members</p>
                    <p className="text-3xl font-bold text-blue-700 mt-1">{navigator.total_assigned_members}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-green-600 text-sm font-medium">Rating</p>
                    <p className="text-3xl font-bold text-green-700 mt-1">{navigator.rating || 0} ★</p>
                  </div>
                </div>
              )}

              {/* Assigned Navigator Section (Only for Nurses) */}
              {navigator.role === 'nurse' && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4">Navigator</h5>
                  {navigator.navigatorAssigned && navigator.navigatorId ? (
                    <div className="flex items-center gap-4">
                      {navigator.navigatorId.profilePic ? (
                        <img 
                          src={navigator.navigatorId.profilePic} 
                          alt={navigator.navigatorId.name}
                          className="w-16 h-16 rounded-full object-cover shadow-md"
                        />
                      ) : (
                        <FaUserCircle className="w-16 h-16 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <h6 className="text-lg font-medium text-gray-800">{navigator.navigatorId.name}</h6>
                        <p className="text-sm text-gray-500">Navigator ID: {navigator.navigatorId.navigatorId || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500">No navigator assigned</p>
                      <button 
                        onClick={() => {
                          setShowNavigatorDropdown(true);
                          fetchNavigators();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <FaUserMd />
                        Assign Navigator
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <AddNavigatorForm 
            onClose={() => setIsEditing(false)} 
            initialData={navigator}
            isEditing={true}
            activeTab={navigator.role === 'nurse' ? 'nurses' : 'navigators'}
            onSuccess={(tab) => {
              setIsEditing(false);
              if (typeof onSuccess === 'function') {
                onSuccess(tab);
              }
              fetchNavigatorDetails();
            }}
          />
        )}

        {showDeleteConfirm && (
          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            title="Delete Navigator"
            message={`Are you sure you want to delete ${navigator.name}? This action cannot be undone.`}
            onConfirm={handleDelete}
            onClose={() => setShowDeleteConfirm(false)}
          />
        )}

        {/* Navigator Selection Modal */}
        {showNavigatorDropdown && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Assign Navigator</h3>
                <button 
                  onClick={() => setShowNavigatorDropdown(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search navigators..."
                  value={navigatorSearch}
                  onChange={(e) => setNavigatorSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {isLoadingNavigators ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : navigatorsList.length > 0 ? (
                  <div className="grid gap-2">
                    {navigatorsList.map((nav) => (
                      <button
                        key={nav._id}
                        onClick={() => handleAssignNavigator(nav)}
                        className="w-full p-4 hover:bg-gray-50 rounded-lg flex items-center gap-4 transition-colors border border-gray-200"
                      >
                        {nav.profilePic ? (
                          <img 
                            src={nav.profilePic} 
                            alt={nav.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="w-12 h-12 text-gray-400" />
                        )}
                        <div className="text-left flex-1">
                          <p className="font-medium text-gray-800">{nav.name}</p>
                          <p className="text-sm text-gray-500">ID: {nav.navigatorId || 'N/A'}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {navigatorSearch ? 'No navigators found' : 'Start typing to search navigators'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavigatorDetail 