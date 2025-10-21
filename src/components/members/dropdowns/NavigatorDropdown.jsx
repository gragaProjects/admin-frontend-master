import { useState, useEffect } from 'react';
import { FaSearch, FaTimes, FaUserClock, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { navigatorsService } from '../../../services/navigatorsService';
import { membersService } from '../../../services/membersService';
import { useSnackbar } from '../../../contexts/SnackbarContext';

const NavigatorDropdown = ({ isOpen, onClose, onAssign, selectedMembers, assignmentStatus, onRefresh }) => {
  const { showSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNavigator, setSelectedNavigator] = useState(null);
  const [navigators, setNavigators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get the appropriate title and button text based on assignment status
  const getAssignmentText = () => {
    const { allAssigned, allUnassigned, mixed } = assignmentStatus;
    
    if (allAssigned) {
      return {
        title: "Change Navigator",
        buttonText: "Change Navigator",
        description: "You are changing the navigator for all selected members."
      };
    } else if (mixed) {
      return {
        title: "Assign & Change Navigator",
        buttonText: "Assign & Change",
        description: "Some members will get new navigators assigned, others will have their navigators changed."
      };
    } else {
      return {
        title: "Assign Navigator",
        buttonText: "Assign Navigator",
        description: "You are assigning navigators to all selected members."
      };
    }
  };

  const assignmentText = getAssignmentText();

  useEffect(() => {
    const fetchNavigators = async () => {
      if (!isOpen) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await navigatorsService.getNavigators({
          search: searchTerm,
          role: 'navigator'
        });
        
        if (response?.status === 'success' && response?.data) {
          setNavigators(response.data);
        } else {
          throw new Error(response?.message || 'Failed to fetch navigators');
        }
      } catch (err) {
        console.error('Error fetching navigators:', err);
        setError('Failed to fetch navigators');
        showSnackbar('Failed to fetch navigators', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchNavigators();
  }, [isOpen, searchTerm]);

  const handleAssign = async () => {
    if (!selectedNavigator || !selectedMembers || selectedMembers.length === 0) {
      showSnackbar('Please select a navigator and at least one member', 'error');
      return;
    }

    // Show confirmation dialog
    setShowConfirmation(true);
  };

  const handleConfirmAssignment = async () => {
    try {
      setAssigning(true);
      setShowConfirmation(false);
      
      // Call the new assignNavigator API endpoint
      const response = await membersService.assignNavigator(selectedMembers, selectedNavigator._id);
      
      if (response.status === 'success') {
        const actionText = assignmentStatus.allAssigned ? 'changed' : 'assigned';
        showSnackbar(`Navigator ${actionText} successfully`, 'success');
        
        // First call onAssign for any parent component state updates
        onAssign(selectedNavigator);
        
        // Then refresh the members list
        if (onRefresh) {
          console.log('NavigatorDropdown: Refreshing members list');
          await onRefresh();
        }
        onClose();
      } else {
        throw new Error(response.message || 'Failed to assign navigator');
      }
    } catch (error) {
      console.error('Error assigning navigator:', error);
      showSnackbar(error.message || 'Failed to assign navigator', 'error');
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
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {assignmentText.title}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <FaTimes size={24} />
            </button>
          </div>

          {/* Description */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start text-blue-700">
              <FaExclamationTriangle className="mr-2 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">{assignmentText.description}</p>
                <p className="text-xs mt-1">
                  {selectedMembers.length} members selected
                </p>
              </div>
            </div>
          </div>

          {/* Selected Members Count */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-gray-700">
              <FaUserClock className="mr-2" />
              <span>{selectedMembers.length} members selected</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search navigators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-4 text-red-500">
              {error}
            </div>
          )}

          {/* Navigators List */}
          {!loading && !error && (
            <div className="max-h-96 overflow-y-auto">
              {navigators.map((navigator) => (
                <div
                  key={navigator._id}
                  onClick={() => setSelectedNavigator(navigator)}
                  className={`p-4 border rounded-lg mb-2 cursor-pointer transition-colors ${
                    selectedNavigator?._id === navigator._id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{navigator.name}</h4>
                      <p className="text-sm text-gray-600">Health Navigator</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Languages: {navigator.languagesSpoken?.join(', ') || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Current Members</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {navigator.total_assigned_members || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {navigators.length === 0 && !loading && (
                <div className="text-center py-4 text-gray-500">
                  No navigators found matching your search.
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedNavigator || assigning}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                selectedNavigator && !assigning 
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
                assignmentText.buttonText
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
                  Confirm {assignmentText.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Are you sure you want to {assignmentStatus.allAssigned ? 'change' : 'assign'} the navigator for {selectedMembers.length} selected member{selectedMembers.length > 1 ? 's' : ''}?
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="text-sm text-gray-700">
                <p><strong>Navigator:</strong> {selectedNavigator.name}</p>
                <p><strong>Members:</strong> {selectedMembers.length}</p>
                {assignmentStatus.mixed && (
                  <p className="text-yellow-600 text-xs mt-2">
                    ⚠️ Some members already have navigators assigned. This action will change their assignments.
                  </p>
                )}
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

export default NavigatorDropdown; 