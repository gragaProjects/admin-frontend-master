import React, { useState, useEffect } from 'react'
import { FaPlus, FaSearch, FaFilter, FaTimes } from 'react-icons/fa'
import EmpDoctorList from './EmpDoctorList'
import EmpAddDoctorForm from './EmpAddDoctorForm'
import EmpDoctorDetail from './EmpDoctorDetail'
import EmpEditDoctorForm from './EmpEditDoctorForm'
import EmpFilterModal from './EmpFilterModal'
import empDoctorsService from '../../services/empDoctorsService'
import { useSnackbar } from '../../contexts/SnackbarContext'

const EmpanelledDoctors = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDoctorDetail, setShowDoctorDetail] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { showSnackbar } = useSnackbar()
  const [filters, setFilters] = useState({
    searchQuery: '',
    speciality: '',
    sortBy: 'name'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({})

  const fetchDoctors = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await empDoctorsService.getAllEmpDoctors()
      if (response.status === 'success') {
        setDoctors(response.data)
      } else {
        throw new Error('Failed to fetch doctors')
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setError('Failed to fetch doctors')
      showSnackbar('Failed to fetch doctors', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const handleDoctorUpdate = async () => {
    setSelectedDoctor(null)
    await fetchDoctors()
  }

  const handleAddDoctor = async () => {
    setShowAddForm(false)
    await fetchDoctors()
  }

  const handleFilterSubmit = (newFilters) => {
    setFilters(newFilters)
    setShowFilterModal(false)
  }

  const handleSearch = () => {
    console.log('Searching for:', searchTerm)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters)
    setIsFilterOpen(false)
    console.log('Applied filters:', filters)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex flex-1 min-w-[300px] gap-2">
          <div className="relative flex-1 flex">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 pl-10 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
            title="Filter doctors"
          >
            <FaFilter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <FaPlus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
        </div>
      </div>

      {showAddForm && (
        <EmpAddDoctorForm
          onClose={() => setShowAddForm(false)}
          onSuccess={handleAddDoctor}
        />
      )}

      {showDoctorDetail && selectedDoctor && (
        <EmpDoctorDetail
          doctor={selectedDoctor}
          onClose={() => {
            setShowDoctorDetail(false)
            setSelectedDoctor(null)
          }}
          onEdit={() => {
            setShowDoctorDetail(false)
            setShowEditForm(true)
          }}
        />
      )}

      {showEditForm && selectedDoctor && (
        <EmpEditDoctorForm
          doctor={selectedDoctor}
          onClose={() => {
            setShowEditForm(false)
            setSelectedDoctor(null)
          }}
        />
      )}

      {showFilterModal && (
        <EmpFilterModal
          filters={filters}
          onSubmit={handleFilterSubmit}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {isFilterOpen && (
        <EmpFilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleApplyFilters}
          currentFilters={activeFilters}
        />
      )}

      <EmpDoctorList
        doctors={doctors}
        isLoading={isLoading}
        error={error}
        onRefresh={fetchDoctors}
        onDoctorSelect={(doctor) => {
          setSelectedDoctor(doctor)
          setShowDoctorDetail(true)
        }}
        filters={filters}
      />
    </div>
  )
}

export default EmpanelledDoctors