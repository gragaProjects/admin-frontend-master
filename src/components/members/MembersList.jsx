import { 
  FaEye, 
  FaPlus, 
  FaDownload,
  FaSpinner,
  FaRegCreditCard,
} from 'react-icons/fa';
import { MedicalHistoryList, AddMedicalHistory } from './MedicalHistory';
import BulkUploadGuide from './BulkUploadGuide';
import { useState, useMemo, useCallback, useRef } from 'react';
import ViewMember from './ViewMember';
import Subscription from './Subscription';
import { membersService } from '../../services/membersService';

const MembersList = ({ 
  members,
  selectedMembers,
  handleCheckboxChange,
  handleSelectAll,
  setShowSubProfiles,
  loading,
  onLoadMore,
  hasMore,
  onRefresh
}) => {
  const observer = useRef();
  const [downloadingId, setDownloadingId] = useState(null);
  
  // Add new download handler
  const handleMembershipCardDownload = useCallback(async (memberId) => {
    try {
      setDownloadingId(memberId);
      const response = await membersService.getMembershipCard(memberId);
      
      if (response?.status === 'success' && response?.data?.s3Url) {
        window.open(response.data.s3Url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading membership card:', error);
      // You might want to show an error message to the user here
    } finally {
      setDownloadingId(null);
    }
  }, []);

  const lastMemberRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore && onLoadMore();
      }
    });
    
    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, onLoadMore]);

  // Filter out only students, keep both members and sub-profiles
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      // Exclude students
      if (member.isStudent || member.type === 'STUDENT') {
        return false;
      }
      return true;
    });
  }, [members]);

  // Helper function to get member ID consistently
  const getMemberId = useCallback((member) => {
    return member.id || member._id;
  }, []);

  // State for modals
  const [showViewMedicalHistory, setShowViewMedicalHistory] = useState(false);
  const [showAddMedicalHistory, setShowAddMedicalHistory] = useState(false);
  const [selectedMemberForHistory, setSelectedMemberForHistory] = useState(null);
  const [showViewMember, setShowViewMember] = useState(false);
  const [showBulkUploadGuide, setShowBulkUploadGuide] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedMemberForSubscription, setSelectedMemberForSubscription] = useState(null);

  // Memoize handlers to prevent unnecessary re-renders
  const handleViewMedicalHistory = useCallback((e, member) => {
    e.stopPropagation();
    setSelectedMemberForHistory(member);
    setShowViewMedicalHistory(true);
  }, []);

  const handleAddMedicalHistory = useCallback((e, member) => {
    e.stopPropagation();
    setSelectedMemberForHistory(member);
    setShowAddMedicalHistory(true);
  }, []);

  const handleMemberClick = useCallback((member) => {
    setSelectedMemberForHistory(member);
    setShowViewMember(true);
  }, []);

  // Add this new handler
  const handleSubscriptionClick = useCallback((e, member) => {
    e.stopPropagation();
    setSelectedMemberForSubscription(member);
    setShowSubscription(true);
  }, []);

  // Memoize helper functions
  const formatMemberName = useCallback((member) => {
    if (!member) return 'N/A';
    return member.name || member.fullName || 'N/A';
  }, []);

  const formatMemberPhone = useCallback((member) => {
    if (!member) return 'N/A';
    return member.phone || member.mobile || 'N/A';
  }, []);

  // Add this helper function at the top of the component
  const getSubprofileCount = (member) => {
    // Check if subprofileIds array exists and has length
    if (Array.isArray(member.subprofileIds)) {
      return member.subprofileIds.length;
    }
    // If subProfiles array exists and has length
    if (Array.isArray(member.subProfiles)) {
      return member.subProfiles.length;
    }
    // Default to 0
    return 0;
  };

  // Memoize the table rows to prevent unnecessary re-renders
  const tableRows = useMemo(() => {
    return filteredMembers.map((member, index) => {
      const isLastElement = index === filteredMembers.length - 1;
      const memberId = getMemberId(member);
      const isSelected = selectedMembers.includes(memberId);
      const isDownloading = downloadingId === memberId;

      return (
        <tr
          key={memberId}
          ref={isLastElement ? lastMemberRef : null}
          onClick={() => handleMemberClick(member)}
          className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
        >
          <td className="w-10 px-2 py-3 whitespace-nowrap">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleCheckboxChange(memberId)}
              onClick={(e) => e.stopPropagation()}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </td>
          <td className="hidden sm:table-cell px-2 sm:px-4 py-3 whitespace-nowrap text-sm">
            {member.memberId || 'N/A'}
          </td>
          <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">
              {formatMemberName(member)}
            </div>
            <div className="sm:hidden text-xs text-gray-500">
              {formatMemberPhone(member)}
            </div>
          </td>
          <td className="hidden sm:table-cell px-2 sm:px-4 py-3 whitespace-nowrap">
            <div className="text-sm text-gray-500">
              {formatMemberPhone(member)}
            </div>
          </td>
          <td className="hidden md:table-cell px-2 sm:px-4 py-3 whitespace-nowrap text-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowSubProfiles(member);
              }}
              className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
            >
              {getSubprofileCount(member)}
            </button>
          </td>
          <td className="hidden lg:table-cell px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-center">
            {member.healthcareTeam?.navigator?._id?.name ? (
              <span className="text-gray-900">
                {member.healthcareTeam.navigator._id.name}
              </span>
            ) : (
              <span className="text-red-500">
                Not Assigned
              </span>
            )}
          </td>
          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-center">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button 
                onClick={(e) => handleViewMedicalHistory(e, member)}
                className="p-1 sm:p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="View Medical History"
              >
                <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={(e) => handleAddMedicalHistory(e, member)}
                className="p-1 sm:p-1.5 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                title="Add Medical History"
              >
                <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </td>
          <td className="hidden sm:table-cell px-2 sm:px-4 py-3 whitespace-nowrap text-center">
            <div className="flex items-center justify-center">
              <FaRegCreditCard 
                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  member.membershipStatus?.premiumMembership?.isActive 
                    ? 'text-green-500' 
                    : 'text-gray-400'
                } cursor-pointer hover:scale-110 transition-transform`}
                title={
                  member.membershipStatus?.premiumMembership?.isActive 
                    ? 'Active Premium Membership' 
                    : 'No Active Premium Membership'
                }
                onClick={(e) => handleSubscriptionClick(e, member)}
              />
            </div>
          </td>
          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-center">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMembershipCardDownload(memberId);
              }}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              disabled={isDownloading}
              title="Download Membership Card"
            >
              {isDownloading ? (
                <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : (
                <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
            </button>
          </td>
        </tr>
      );
    });
  }, [filteredMembers, selectedMembers, handleCheckboxChange, handleMembershipCardDownload, handleViewMedicalHistory, handleAddMedicalHistory, handleMemberClick, handleSubscriptionClick, formatMemberName, formatMemberPhone, getMemberId, lastMemberRef, setShowSubProfiles, downloadingId]);

  const handleMemberDeleted = () => {
    // Clear any selected members
    handleSelectAll({ target: { checked: false } });
    // Trigger refresh
    onRefresh && onRefresh();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white sticky top-0 shadow-sm">
            <tr>
              <th scope="col" className="w-10 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                <input
                  type="checkbox"
                  checked={filteredMembers.length > 0 && selectedMembers.length > 0 && selectedMembers.length === filteredMembers.length}
                  onChange={(e) => handleSelectAll(e)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th scope="col" className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                M-ID
              </th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                Name
              </th>
              <th scope="col" className="hidden sm:table-cell px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                Phone
              </th>
              <th scope="col" className="hidden md:table-cell px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                Sub Profiles
              </th>
              <th scope="col" className="hidden lg:table-cell px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                Navigator
              </th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                Medical History
              </th>
              <th scope="col" className="hidden sm:table-cell px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                Subscription
              </th>
              <th scope="col" className="px-2 sm:px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMembers.map((member, index) => {
              const isLastElement = index === filteredMembers.length - 1;
              const memberId = getMemberId(member);
              const isSelected = selectedMembers.includes(memberId);
              const isDownloading = downloadingId === memberId;

              return (
                <tr
                  key={memberId}
                  ref={isLastElement ? lastMemberRef : null}
                  onClick={() => handleMemberClick(member)}
                  className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <td className="w-10 px-2 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckboxChange(memberId)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </td>
                  <td className="hidden sm:table-cell px-2 sm:px-4 py-3 whitespace-nowrap text-sm">
                    {member.memberId || 'N/A'}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatMemberName(member)}
                    </div>
                    <div className="sm:hidden text-xs text-gray-500">
                      {formatMemberPhone(member)}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-2 sm:px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatMemberPhone(member)}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-2 sm:px-4 py-3 whitespace-nowrap text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSubProfiles(member);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      {getSubprofileCount(member)}
                    </button>
                  </td>
                  <td className="hidden lg:table-cell px-2 sm:px-4 py-3 whitespace-nowrap text-sm text-center">
                    {member.healthcareTeam?.navigator?._id?.name ? (
                      <span className="text-gray-900">
                        {member.healthcareTeam.navigator._id.name}
                      </span>
                    ) : (
                      <span className="text-red-500">
                        Not Assigned
                      </span>
                    )}
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button 
                        onClick={(e) => handleViewMedicalHistory(e, member)}
                        className="p-1 sm:p-1.5 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                        title="View Medical History"
                      >
                        <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        onClick={(e) => handleAddMedicalHistory(e, member)}
                        className="p-1 sm:p-1.5 text-green-500 hover:bg-green-50 rounded-full transition-colors"
                        title="Add Medical History"
                      >
                        <FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-2 sm:px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <FaRegCreditCard 
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          member.membershipStatus?.premiumMembership?.isActive 
                            ? 'text-green-500' 
                            : 'text-gray-400'
                        } cursor-pointer hover:scale-110 transition-transform`}
                        title={
                          member.membershipStatus?.premiumMembership?.isActive 
                            ? 'Active Premium Membership' 
                            : 'No Active Premium Membership'
                        }
                        onClick={(e) => handleSubscriptionClick(e, member)}
                      />
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-center">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMembershipCardDownload(memberId);
                      }}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      disabled={isDownloading}
                      title="Download Membership Card"
                    >
                      {isDownloading ? (
                        <FaSpinner className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
            {loading && (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  <FaSpinner className="w-6 h-6 text-blue-500 animate-spin mx-auto" />
                </td>
              </tr>
            )}
            {!loading && filteredMembers.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Medical History List Modal */}
      {showViewMedicalHistory && selectedMemberForHistory && (
        <MedicalHistoryList
          member={selectedMemberForHistory}
          onClose={() => {
            setShowViewMedicalHistory(false);
            setSelectedMemberForHistory(null);
          }}
        />
      )}

      {/* Add Medical History Modal */}
      {showAddMedicalHistory && selectedMemberForHistory && (
        <AddMedicalHistory
          member={selectedMemberForHistory}
          onClose={() => {
            setShowAddMedicalHistory(false);
            setSelectedMemberForHistory(null);
          }}
          onSave={(data) => {
            // Handle saving medical history data
            console.log('Saving medical history:', data);
            setShowAddMedicalHistory(false);
            setSelectedMemberForHistory(null);
            onRefresh && onRefresh(); // Refresh the list after saving
          }}
        />
      )}

      {/* View Member Modal */}
      {showViewMember && selectedMemberForHistory && (
        <ViewMember
          memberId={selectedMemberForHistory.id || selectedMemberForHistory._id}
          member={selectedMemberForHistory}
          onClose={() => {
            setShowViewMember(false);
            setSelectedMemberForHistory(null);
          }}
          onEdit={async (updatedMember) => {
            console.log('MembersList: Member updated, triggering refresh');
            onRefresh && await onRefresh();
            setShowViewMember(false);
            setSelectedMemberForHistory(null);
          }}
          onDelete={handleMemberDeleted}
        />
      )}

      {/* Bulk Upload Guide Modal */}
      <BulkUploadGuide
        isOpen={showBulkUploadGuide}
        onClose={() => setShowBulkUploadGuide(false)}
      />

      {/* Add Subscription Modal */}
      <Subscription
        isOpen={showSubscription}
        onClose={() => {
          setShowSubscription(false);
          setSelectedMemberForSubscription(null);
        }}
        member={selectedMemberForSubscription}
      />
    </div>
  );
};

export default MembersList; 