import { FaTimes } from 'react-icons/fa'
import Select from 'react-select'
import { useState, useEffect } from 'react'

const FilterModal = ({ isOpen, onClose, filters, onApplyFilters, role = 'navigator' }) => {
  const [tempFilters, setTempFilters] = useState({
    gender: null,
    languages: [],
    rating: null
  });

  useEffect(() => {
    setTempFilters({
      gender: filters?.gender || null,
      languages: filters?.languages || [],
      rating: filters?.rating || null
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleReset = () => {
    setTempFilters({
      gender: null,
      languages: [],
      rating: null
    });
  };

  const handleApply = () => {
    const filterParams = {};
    
    // Add gender if selected
    if (tempFilters.gender?.value) {
      filterParams.gender = tempFilters.gender.value.toLowerCase();
    }

    // Add languages if selected
    if (tempFilters.languages?.length > 0) {
      filterParams.languages = tempFilters.languages.map(lang => lang.label).join(',');
    }

    // Add rating if selected
    if (tempFilters.rating?.value) {
      filterParams.rating = tempFilters.rating.value;
    }

    // Pass the filter parameters to parent component
    onApplyFilters(filterParams);
    onClose();
  };

  // Custom styles for React-Select
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
    }),
    menu: (base) => ({
      ...base,
      zIndex: 99999,
      position: 'absolute',
      width: '100%',
      marginTop: '2px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: '160px',
      minHeight: '120px',
      paddingTop: '4px',
      paddingBottom: '4px',
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '100%'
      },
      '&::-webkit-scrollbar-track': {
        background: '#f1f1f1'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#888',
        borderRadius: '3px'
      }
    }),
    option: (base, state) => ({
      ...base,
      padding: '8px 12px',
      backgroundColor: state.isFocused ? '#f0f9ff' : 'white',
      '&:hover': {
        backgroundColor: '#f0f9ff'
      }
    })
  };

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'tamil', label: 'Tamil' },
    { value: 'telugu', label: 'Telugu' },
    { value: 'malayalam', label: 'Malayalam' },
    { value: 'kannada', label: 'Kannada' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const ratingOptions = [
    { value: 5, label: '5 Stars' },
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' }
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-visible text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Filter {role === 'nurse' ? 'Nurses' : 'Navigators'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Gender Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <Select
                value={tempFilters.gender}
                onChange={(selected) => handleFilterChange('gender', selected)}
                options={genderOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select gender..."
                isClearable
                styles={customStyles}
              />
            </div>

            {/* Languages Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              <Select
                isMulti
                value={tempFilters.languages}
                onChange={(selected) => handleFilterChange('languages', selected)}
                options={languageOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select languages..."
                styles={customStyles}
              />
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <Select
                value={tempFilters.rating}
                onChange={(selected) => handleFilterChange('rating', selected)}
                options={ratingOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select rating..."
                isClearable
                styles={customStyles}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 