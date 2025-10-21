import { useState, useEffect } from 'react';
import { FaUserMd, FaSearch, FaSpinner, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { doctorsService } from '../../../services/doctorsService';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { membersService } from '../../../services/membersService';

const DoctorDropdown = ({ isOpen, onClose, onAssign, selectedMembers }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (isOpen) {
      loadDoctors();
    }
  }, [isOpen, searchTerm]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorsService.getDoctors({
        page: 1,
        limit: 50,
        search: searchTerm
      });
      
      if (response.status === 'success' && response.data) {
        setDoctors(response.data);
      } else {
        throw new Error(response?.message || 'Failed to fetch doctors');
      }
    } catch (error) {
      console.error('Error loading doctors:', error);
      showSnackbar('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedDoctor || !selectedMembers || selectedMembers.length === 0) {
      showSnackbar('Please select a doctor and at least one member', 'error');
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmAssignment = async () => {
    try {
      setAssigning(true);
      setShowConfirmation(false);
      
      // Call the new assignDoctor API endpoint
      const response = await membersService.assignDoctor(selectedMembers, selectedDoctor._id);
      
      if (response.status === 'success') {
        showSnackbar('Doctor assigned successfully', 'success');
        onAssign(selectedDoctor);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to assign doctor');
      }
    } catch (error) {
      console.error('Error assigning doctor:', error);
      showSnackbar(error.message || 'Failed to assign doctor', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleCancelAssignment = () => {
    setShowConfirmation(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Assign Doctor</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Description */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start text-blue-700">
              <FaExclamationTriangle className="mr-2 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">You are assigning a doctor to all selected members.</p>
                <p className="text-xs mt-1">
                  {selectedMembers.length} members selected
                </p>
              </div>
            </div>
          </div>

          {/* Selected Members Count */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-gray-700">
              <FaUserMd className="mr-2" />
              <span>{selectedMembers.length} members selected</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mb-4">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-blue-500 text-2xl" />
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No doctors found
              </div>
            ) : (
              <div className="space-y-2">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${
                      selectedDoctor?._id === doctor._id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    {doctor.profilePic ? (
                      <img
                        src={doctor.profilePic}
                        alt={doctor.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUserMd className="text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{doctor.name}</div>
                      <div className="text-sm text-gray-500">
                        {doctor.specializations?.join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Languages: {doctor.languagesSpoken?.join(', ') || 'N/A'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Current Members</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {doctor.total_assigned_members || 0}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedDoctor || !selectedMembers?.length || assigning}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                selectedDoctor && !assigning 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {assigning ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Processing...
                </div>
              ) : (
                'Assign Doctor'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start mb-4">
              <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Doctor Assignment
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to assign the doctor for {selectedMembers.length} selected member{selectedMembers.length > 1 ? 's' : ''}?
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="text-sm text-gray-700">
                <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                <p><strong>Members:</strong> {selectedMembers.length}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelAssignment}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignment}
                disabled={assigning}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {assigning ? (
                  <div className="flex items-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDropdown; 