import { useState, useEffect } from 'react'
import { doctorsService } from '../../../services/doctorsService'
import DoctorsList from './DoctorsList'
import DoctorDetail from './DoctorDetail'
import AddEditDoctor from './AddEditDoctor'
import AssignedMembersModal from './AssignedMembersModal'

const NewDoctors = () => {
  const itemsPerPage = 9 // Show 9 doctors per page (3x3 grid)

  const [doctors, setDoctors] = useState([])
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [filters, setFilters] = useState({})

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: itemsPerPage
  })

  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAssignedMembers, setShowAssignedMembers] = useState(false)

  // ✅ Fetch all doctors from API
  const fetchDoctors = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = {
        page: currentPage,
        limit: itemsPerPage
      }

      const response = await doctorsService.getDoctors(params)

      if (response.status === 'success') {
        setDoctors(response.data || [])
        setFilteredDoctors(response.data || [])
        setPagination(response.pagination || { total: 0, page: 1, pages: 1, limit: itemsPerPage })
      } else {
        setError('Failed to fetch doctors. Please try again later.')
      }
    } catch (err) {
      console.error('Error fetching doctors:', err)
      setError('Failed to fetch doctors. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ Run fetchDoctors on mount + when page changes
  useEffect(() => {
    fetchDoctors()
  }, [currentPage])

  // ✅ When filters change, apply them to doctors list
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredDoctors(doctors)
      return
    }

    const filtered = doctors.filter((doc) => {
      const search = filters.search?.toLowerCase() || ''

      if (
        search &&
        ![doc.name, doc.email, doc.phone]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(search)
      )
        return false

      if (filters.department && doc.departmentDetails?.department !== filters.department)
        return false

      if (filters.service && !(doc.departmentDetails?.services || []).includes(filters.service))
        return false

      if (
        filters.subService &&
        !(doc.departmentDetails?.subServices || []).includes(filters.subService)
      )
        return false

      if (
        filters.consultationType &&
        !(doc.serviceTypes || []).includes(filters.consultationType)
      )
        return false

      if (
        filters.city &&
        !doc.offlineAddress?.city?.toLowerCase().includes(filters.city.toLowerCase())
      )
        return false

      if (
        filters.state &&
        !doc.offlineAddress?.state?.toLowerCase().includes(filters.state.toLowerCase())
      )
        return false

      return true
    })

    setFilteredDoctors(filtered)
  }, [filters, doctors])

  // ✅ Receive filters from DoctorsFilter.jsx
  const handleFilterChange = (newFilters) => {
    console.log('Received Filters:', newFilters)
    setFilters(newFilters)
    setCurrentPage(1)
  }

  // ✅ View Profile
  const handleViewProfile = async (doctor) => {
    try {
      const response = await doctorsService.getDoctorById(doctor._id)
      if (response.status === 'success' && response.data) {
        setSelectedDoctor(response.data)
      } else {
        setError('Failed to fetch doctor details.')
      }
    } catch (err) {
      setError('Failed to fetch doctor details.')
      console.error('Error fetching doctor details:', err)
    }
  }

  // ✅ View Members
  const handleViewMembers = async (doctor) => {
    try {
      const response = await doctorsService.getDoctorById(doctor.id)
      if (response.status === 'success' && response.data) {
        setSelectedDoctor(response.data)
        setShowAssignedMembers(true)
      } else {
        setError('Failed to fetch doctor details.')
      }
    } catch (err) {
      setError('Failed to fetch doctor details.')
      console.error('Error fetching doctor details:', err)
    }
  }

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      <DoctorsList
        doctors={filteredDoctors}
        isLoading={isLoading}
        onViewProfile={handleViewProfile}
        onViewMembers={handleViewMembers}
        onAddDoctor={() => setShowAddForm(true)}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onFilterChange={handleFilterChange}
      />

      {showAddForm && (
        <AddEditDoctor
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false)
            fetchDoctors() // Refresh list after adding
          }}
        />
      )}

      {selectedDoctor && !showAssignedMembers && (
        <DoctorDetail
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onDeleteSuccess={() => {
            setSelectedDoctor(null)
            fetchDoctors()
          }}
        />
      )}

      {showAssignedMembers && selectedDoctor && (
        <AssignedMembersModal
          isOpen={showAssignedMembers}
          onClose={() => {
            setShowAssignedMembers(false)
            setSelectedDoctor(null)
          }}
          doctor={selectedDoctor}
        />
      )}

      {error && <div className="text-red-500 text-center py-4">{error}</div>}
    </div>
  )
}

export default NewDoctors
