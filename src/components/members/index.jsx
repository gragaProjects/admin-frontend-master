import { useState, useEffect, useMemo, useRef } from 'react';
import {  
  FaPlus, 
  FaUpload, 
  FaUserMd, 
  FaUserClock,
  FaSearch,
  FaCheck,
  FaFilter,
  FaTimes
} from 'react-icons/fa';
import membersService from '../../services/membersService';
import api from '../../services/api';
import { useSnackbar } from '../../contexts/SnackbarContext';
import MemberFilter from './MemberFilter';
import MembersList from './MembersList';
import AddEditMember from './AddEditMember';
import { DoctorDropdown, NavigatorDropdown } from './dropdowns';
import { SubProfilesModal } from './modals';
import ViewMember from './ViewMember';
import BulkUploadGuide from './BulkUploadGuide';

const Members = () => {
  const { showSnackbar } = useSnackbar();
  const isInitialMount = useRef(true);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalMembers, setTotalMembers] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showSubProfilesModal, setShowSubProfilesModal] = useState(false);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showNavigatorDropdown, setShowNavigatorDropdown] = useState(false);
  const [showBulkUploadGuide, setShowBulkUploadGuide] = useState(false);
  const [bulkMode, setBulkMode] = useState('insert');
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedMemberForView, setSelectedMemberForView] = useState(null);

  // Single effect to handle both initial load and subsequent updates
  useEffect(() => {
    const fetchData = async () => {
      // Skip if loading
      if (loading) return;

      // On initial mount
      if (isInitialMount.current) {
        isInitialMount.current = false;
        await fetchMembers(1, false);
        return;
      }

      // For subsequent filter changes
      if (!searchTerm) {
        await fetchMembers(1, false);
      }
    };

    fetchData();
  }, [activeFilters]); // activeFilters dependency only

  // Remove the search effect since we'll only search on button click

  const fetchMembers = async (pageNum = 1, shouldAppend = false, clearSearch = false) => {
    try {
      if (loading) return; // Prevent concurrent requests
      
      console.log('Members: Fetching members, page:', pageNum);
      setLoading(true);
      setError(null);

      const queryParams = {
        isStudent: false,
        type: { $ne: 'STUDENT' },
        page: pageNum,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'asc',
        includeSubprofileCount: true,
        ...(clearSearch ? {} : {
          ...activeFilters,
          ...(searchTerm && { search: searchTerm })
        })
      };

      console.log('Members: Fetch params:', queryParams);
      const response = await membersService.getMembers(queryParams);

      if (response?.status === 'success') {
        const newMembers = response.data || [];
        console.log('Members: Fetch successful, count:', newMembers.length);
        
        setHasMore(response.pagination?.page < response.pagination?.pages);
        setMembers(prev => shouldAppend ? [...prev, ...newMembers] : newMembers);
        setTotalMembers(response.pagination?.total || 0);
        setPage(pageNum);
      } else {
        throw new Error('Failed to fetch members');
      }
    } catch (error) {
      console.error('Members: Error fetching list:', error);
      setError(error.message || 'Failed to fetch members');
      showSnackbar(error.message || 'Failed to fetch members', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    // Only search if there's a search term
    if (searchTerm.trim()) {
      fetchMembers(1, false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMembers(nextPage, true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch();
    }
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setPage(1);
  };

  const handleCheckboxChange = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const allMemberIds = members
      .filter(member => !member.isStudent && member.type !== 'STUDENT' && !member.primaryMemberId)
      .map(member => member.id || member._id);
    
    setSelectedMembers(isChecked ? allMemberIds : []);
  };

  const handleBulkUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${api.defaults.baseURL}/api/v1/members/bulk-insert`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        showSnackbar('Members uploaded successfully', 'success');
        await fetchMembers(1, false);
        setShowBulkUploadGuide(false);
      } else {
        throw new Error(data.message || 'Failed to upload members');
      }
    } catch (error) {
      console.error('Error uploading members:', error);
      throw error; // Re-throw the error so BulkUploadGuide can handle it
    } finally {
      setLoading(false);
    }
  };

  const handleSubProfilesView = async (member) => {
    try {
      if (!member || (!member.id && !member._id)) {
        showSnackbar('Member ID is required', 'error');
        return;
      }

      const memberId = member.id || member._id;
      setLoading(true);

      const response = await membersService.getMembers({
        primaryMemberId: memberId,
        isSubprofile: true,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      });
      
      if (response.status === 'success') {
        const filteredSubprofiles = response.data.filter(profile => {
          const profilePrimaryId = profile.primaryMemberId?._id || profile.primaryMemberId;
          return profilePrimaryId === memberId;
        });

        setSelectedMember({
          ...member,
          subProfiles: filteredSubprofiles
        });
        setShowSubProfilesModal(true);
      } else {
        throw new Error(response.message || 'Failed to fetch subprofiles');
      }
    } catch (error) {
      console.error('Error fetching subprofiles:', error);
      showSnackbar(error.message || 'Failed to fetch subprofiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubProfileSelect = async (subProfileId) => {
    try {
      setLoading(true);
      const response = await membersService.getMemberById(subProfileId);
      
      if (response.status === 'success' && response.data) {
        setShowSubProfilesModal(false);
        setSelectedMemberForView({
          memberId: subProfileId,
          member: response.data
        });
      } else {
        throw new Error(response.message || 'Failed to fetch subprofile details');
      }
    } catch (error) {
      console.error('Error fetching subprofile details:', error);
      showSnackbar(error.message || 'Failed to fetch subprofile details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelect = async (member) => {
    try {
      if (!member || (!member.id && !member._id)) {
        showSnackbar('Member ID is required', 'error');
        return;
      }
      
      const memberId = member.id || member._id;
      setLoading(true);
      const response = await membersService.getMemberById(memberId);
      
      if (response.status === 'success' && response.data) {
        setSelectedMemberForView({
          memberId: memberId,
          member: response.data
        });
      } else {
        throw new Error(response.message || 'Failed to fetch member details');
      }
    } catch (error) {
      console.error('Error selecting member:', error);
      showSnackbar(error.message || 'Failed to fetch member details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorAssign = (doctor) => {
    const updatedMembers = members.map(member => {
      if (selectedMembers.includes(member.id)) {
        return {
          ...member,
          assignedDoctor: {
            name: doctor.name,
            specialization: doctor.specialization
          }
        };
      }
      return member;
    });
    setMembers(updatedMembers);
    setSelectedMembers([]);
    setShowDoctorDropdown(false);
  };

  const handleNavigatorAssign = (navigator) => {
    const updatedMembers = members.map(member => {
      if (selectedMembers.includes(member.id)) {
        return {
          ...member,
          assignedNavigator: {
            name: navigator.name,
            role: navigator.role
          }
        };
      }
      return member;
    });
    setMembers(updatedMembers);
    setSelectedMembers([]);
    setShowNavigatorDropdown(false);
  };

  const handleMemberSubmit = async (memberData) => {
    // Refresh the members list
    await fetchMembers(1, false);
  };

  const handleEditMember = async (updatedMember) => {
    try {
      console.log('Members: Refreshing list after member update');
      await fetchMembers(1, false);
    } catch (error) {
      console.error('Members: Error refreshing list:', error);
      showSnackbar('Failed to refresh members list', 'error');
    }
  };

  const handleDeleteMember = (memberId) => {
    setMembers(prevMembers => 
      prevMembers.filter(member => member.id !== memberId)
    );
  };

  const formatMemberData = (member) => {
    if (!member) return null;
    
    return {
      id: member._id,
      memberId: member.memberId || 'N/A',
      fullName: member.name || 'N/A',
      email: member.email || 'N/A',
      mobile: member.phone || 'N/A',
      gender: member.gender || 'N/A',
      dob: member.dob || 'N/A',
      membershipType: member.isStudent ? 'Student' : 'Regular',
      bloodGroup: member.bloodGroup || 'Not specified',
      height: member.heightInFt ? `${member.heightInFt} ft` : 'Not specified',
      weight: member.weightInKg ? `${member.weightInKg} kg` : 'Not specified',
      emergencyContact: member.emergencyContact ? {
        name: member.emergencyContact.name || 'N/A',
        relationship: member.emergencyContact.relation || 'N/A',
        number: member.emergencyContact.phone || 'N/A'
      } : null,
      personalHistory: {
        employmentStatus: member.employmentStatus || 'Not specified',
        educationLevel: member.educationLevel || 'Not specified',
        maritalStatus: member.maritalStatus || 'Not specified'
      },
      address: member.address ? 
        `${member.address.description || ''}, ${member.address.region || ''}, ${member.address.pinCode || ''}`.trim() : 
        'Not specified',
      rawAddress: member.address || null,
      status: member.active ? 'active' : 'inactive',
      registrationDate: member.createdAt || 'N/A',
      lastVisit: member.updatedAt || 'N/A',
      subprofileIds: member.subprofileIds || [],
      isStudent: member.isStudent || false,
      isSubprofile: member.isSubprofile,
      studentDetails: member.studentDetails || null,
      subscriptions: member.subscriptions || [],
      addons: member.addons || [],
      subprofilesCount: Array.isArray(member.subprofileIds) ? member.subprofileIds.length : 0
    };
  };

  // Helper function to get navigator assignment status for selected members
  const getNavigatorAssignmentStatus = useMemo(() => {
    if (selectedMembers.length === 0) return { allAssigned: false, allUnassigned: false, mixed: false };
    
    const selectedMemberObjects = members.filter(member => 
      selectedMembers.includes(member.id || member._id)
    );
    
    const assignedCount = selectedMemberObjects.filter(member => 
      member.healthcareTeam?.navigator?._id?.name
    ).length;
    
    const unassignedCount = selectedMemberObjects.length - assignedCount;
    
    if (assignedCount === 0) {
      return { allAssigned: false, allUnassigned: true, mixed: false };
    } else if (unassignedCount === 0) {
      return { allAssigned: true, allUnassigned: false, mixed: false };
    } else {
      return { allAssigned: false, allUnassigned: false, mixed: true };
    }
  }, [selectedMembers, members]);

  // Helper function to get navigator button text
  const getNavigatorButtonText = useMemo(() => {
    const { allAssigned, allUnassigned, mixed } = getNavigatorAssignmentStatus;
    
    if (allAssigned) {
      return "Change Navigator";
    } else if (mixed) {
      return "Assign & Change";
    } else {
      return "Assign Navigator";
    }
  }, [getNavigatorAssignmentStatus]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-1 min-w-[300px] gap-2">
              <div className="relative flex-1 flex">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-2 pl-10 pr-10 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {searchTerm && (
                    <button
                      onClick={async () => {
                        setSearchTerm('');
                        setActiveFilters({});
                        setPage(1);
                        await fetchMembers(1, false, true);
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      title="Clear search"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaSearch className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Filter members"
              >
                <FaFilter className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNavigatorDropdown(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                disabled={selectedMembers.length === 0}
              >
                <FaUserClock className="w-4 h-4" />
                <span>{getNavigatorButtonText}</span>
              </button>
              <button
                onClick={() => setShowDoctorDropdown(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                disabled={selectedMembers.length === 0}
              >
                <FaUserMd className="w-4 h-4" />
                <span>Assign Doctor</span>
              </button>
              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                <span>Add Member</span>
              </button>
              <button
                onClick={() => {
                  setBulkMode('insert');
                  setShowBulkUploadGuide(true);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <FaUpload className="w-4 h-4" />
                <span>Bulk Insert</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <MembersList
          members={members}
          selectedMembers={selectedMembers}
          handleCheckboxChange={handleCheckboxChange}
          handleSelectAll={handleSelectAll}
          onMemberSelect={handleMemberSelect}
          setShowSubProfiles={handleSubProfilesView}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          onRefresh={async () => {
            console.log('Index: Refreshing members list');
            await fetchMembers(1, false);
          }}
        />
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {selectedMembers.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaCheck className="text-blue-500" />
              <span className="text-blue-700 font-medium">
                {selectedMembers.length} members selected
              </span>
            </div>
            <button
              onClick={() => setSelectedMembers([])}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {selectedMemberForView && (
        <ViewMember
          memberId={selectedMemberForView.memberId}
          member={selectedMemberForView.member}
          onClose={() => setSelectedMemberForView(null)}
          onEdit={async (updatedMember) => {
            console.log('Index: Member updated, refreshing list');
            await fetchMembers(1, false);
            setSelectedMemberForView(null);
          }}
          onDelete={(memberId) => {
            handleDeleteMember(memberId);
            fetchMembers(1, false);
          }}
        />
      )}

      {showAddMemberModal && !selectedMemberForView && (
        <AddEditMember
          onClose={() => {
            setShowAddMemberModal(false);
            setEditingMember(null);
          }}
          onSubmit={handleMemberSubmit}
          initialData={editingMember}
          isEditing={!!editingMember}
          mainMembers={members.filter(m => !m.isSubprofile)}
          onSuccess={async () => {
            await fetchMembers(1, false);
          }}
        />
      )}

      <BulkUploadGuide
        isOpen={showBulkUploadGuide}
        onClose={() => setShowBulkUploadGuide(false)}
        onFileUpload={handleBulkUpload}
        mode={bulkMode}
      />

      <MemberFilter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={activeFilters}
      />

      {showSubProfilesModal && selectedMember && (
        <SubProfilesModal
          member={selectedMember}
          onClose={() => {
            setShowSubProfilesModal(false);
            setSelectedMember(null);
          }}
          loading={loading}
          onSubProfileSelect={handleSubProfileSelect}
        />
      )}

      {showDoctorDropdown && (
        <DoctorDropdown
          isOpen={showDoctorDropdown}
          onClose={() => setShowDoctorDropdown(false)}
          onAssign={handleDoctorAssign}
          selectedMembers={selectedMembers}
        />
      )}

      {showNavigatorDropdown && (
        <NavigatorDropdown
          isOpen={showNavigatorDropdown}
          onClose={() => setShowNavigatorDropdown(false)}
          onAssign={handleNavigatorAssign}
          selectedMembers={selectedMembers}
          assignmentStatus={getNavigatorAssignmentStatus}
          onRefresh={async () => {
            console.log('Members: Refreshing list after navigator assignment');
            await fetchMembers(1, false);
          }}
        />
      )}
    </div>
  );
};

export default Members; 