import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaUserCircle, FaPhone, FaUserMd, FaFilter, FaEdit, FaTrash } from 'react-icons/fa';
import { navigatorsService } from '../../services/navigatorsService.js';
import { useNavigate } from 'react-router-dom';
import { showSnackbar } from '../../utils/snackbar';
import FilterModal from './FilterModal';

const NavigatorList = ({ searchTerm, setSearchTerm, setShowAddForm, setSelectedNavigator, setShowAssignedMembers, role = 'navigator', refreshKey = 0 }) => {
  const navigate = useNavigate();
  const [navigators, setNavigators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    gender: null,
    languages: null,
    city: null,
    area: null,
    minExperience: '',
    maxExperience: '',
    minRating: '',
    maxRating: '',
    sortBy: { value: 'name', label: 'Name (A-Z)' }
  });

  const fetchNavigators = async (filterParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await navigatorsService.getNavigators({
        search: searchTerm,
        page: pagination.page,
        limit: pagination.limit,
        role: role,
        ...filterParams
      });
      
      if (response?.status === 'success' && response?.data) {
        setNavigators(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error('Failed to fetch navigators');
      }
    } catch (err) {
      setError('Failed to fetch navigators. Please try again later.');
      console.error('Error fetching navigators:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNavigators();
  }, [searchTerm, pagination.page, refreshKey]);

  const handleFilterApply = (filterParams) => {
    fetchNavigators(filterParams);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this navigator?')) {
      try {
        const response = await navigatorsService.deleteNavigator(id);
        if (response?.status === 'success') {
          showSnackbar(`${role.charAt(0).toUpperCase() + role.slice(1)} deleted successfully`, 'success');
          fetchNavigators();
        } else {
          throw new Error(response?.message || 'Failed to delete navigator');
        }
      } catch (error) {
        console.error('Error deleting navigator:', error);
        showSnackbar(error.message || 'Error deleting navigator', 'error');
      }
    }
  };

  const filteredNavigators = navigators.filter(navigator => {
    // Search query filter
    const matchesSearch = searchTerm === '' || 
      navigator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      navigator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      navigator.phone.includes(searchTerm);

    // Gender filter
    const matchesGender = !filters.gender || navigator.gender === filters.gender.value;

    // Languages filter
    const matchesLanguages = !filters.languages || 
      filters.languages.every(lang => navigator.languagesSpoken.includes(lang.value));

    // City filter
    const matchesCity = !filters.city || navigator.city === filters.city.value;

    // Area filter
    const matchesArea = !filters.area || navigator.area === filters.area.value;

    // Experience range filter
    const experience = navigator.experience || 0;
    const matchesExperience = (!filters.minExperience || experience >= Number(filters.minExperience)) &&
      (!filters.maxExperience || experience <= Number(filters.maxExperience));

    // Rating range filter
    const rating = navigator.rating || 0;
    const matchesRating = (!filters.minRating || rating >= Number(filters.minRating)) &&
      (!filters.maxRating || rating <= Number(filters.maxRating));

    return matchesSearch && matchesGender && matchesLanguages && matchesCity && 
           matchesArea && matchesExperience && matchesRating;
  });

  // Sort navigators
  const sortedNavigators = [...filteredNavigators].sort((a, b) => {
    switch (filters.sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'experience':
        return (b.experience || 0) - (a.experience || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'patients':
        return (b.total_assigned_members || 0) - (a.total_assigned_members || 0);
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <h2 className="text-2xl font-semibold">Navigators</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <input
              type="text"
              placeholder="Search by name, email, phone or language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaFilter className="text-gray-600" />
            <span>Filters</span>
          </button>
          
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
          >
            <FaPlus />
            Add Navigator
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}

      <div className="text-sm text-gray-500">
        Showing {navigators.length} of {pagination.total} {pagination.total === 1 ? 'navigator' : 'navigators'}
        {searchTerm && ` for "${searchTerm}"`}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNavigators.map((item) => (
            <div 
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  {item.profilePic ? (
                    <img 
                      src={item.profilePic} 
                      alt={item.name}
                      className="w-20 h-20 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <FaUserCircle className="w-20 h-20 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-500 capitalize">{item.gender}</p>
                    <p className="text-sm text-gray-500 mt-1">ID: {item.navigatorId || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaPhone className="text-blue-500" />
                    {item.phone}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.languagesSpoken?.map((language, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
                

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setSelectedNavigator(item);
                      setShowAssignedMembers(true);
                    }}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2.5 rounded-xl transition-colors font-medium"
                  >
                    Assigned Members
                  </button>
                  <button 
                    onClick={() => setSelectedNavigator(item)}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl transition-colors font-medium"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {navigators.length === 0 && !isLoading && (
            <div className="col-span-full flex items-center justify-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500 text-lg">No navigators found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className={`px-3 py-1 rounded-lg ${
                pagination.page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter(page => {
                const delta = 2;
                return (
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= pagination.page - delta && page <= pagination.page + delta)
                );
              })
              .map((page, i, array) => (
                <button
                  key={page}
                  onClick={() => setPagination(prev => ({ ...prev, page }))}
                  className={`px-3 py-1 rounded-lg ${
                    pagination.page === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className={`px-3 py-1 rounded-lg ${
                pagination.page === pagination.pages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleFilterApply}
      />
    </>
  );
};

export default NavigatorList; 