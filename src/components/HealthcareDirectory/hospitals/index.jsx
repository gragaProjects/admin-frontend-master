// import { useState, useEffect } from 'react'
// import { doctorsService } from '../../../services/doctorsService'
// import DoctorsList from './DoctorsList'
// import DoctorDetail from './DoctorDetail'
// import AddEditHospital from './AddEditHospital'
// import AssignedMembersModal from './AssignedMembersModal'

// const ShowHospital = () => {
//   const itemsPerPage = 9 // Show 9 doctors per page (3x3 grid)

//   const [doctors, setDoctors] = useState([])
//   const [filteredDoctors, setFilteredDoctors] = useState([])
//   const [filters, setFilters] = useState({})

//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [pagination, setPagination] = useState({
//     total: 0,
//     page: 1,
//     pages: 1,
//     limit: itemsPerPage
//   })

//   const [selectedDoctor, setSelectedDoctor] = useState(null)
//   const [showAddForm, setShowAddForm] = useState(false)
//   const [showAssignedMembers, setShowAssignedMembers] = useState(false)

//   // ✅ Fetch all doctors from API
//   const fetchDoctors = async () => {
//     try {
//       setIsLoading(true)
//       setError(null)

//       const params = {
//         page: currentPage,
//         limit: itemsPerPage
//       }

//       const response = await doctorsService.getDoctors(params)

//       if (response.status === 'success') {
//         setDoctors(response.data || [])
//         setFilteredDoctors(response.data || [])
//         setPagination(response.pagination || { total: 0, page: 1, pages: 1, limit: itemsPerPage })
//       } else {
//         setError('Failed to fetch doctors. Please try again later.')
//       }
//     } catch (err) {
//       console.error('Error fetching doctors:', err)
//       setError('Failed to fetch doctors. Please try again later.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // ✅ Run fetchDoctors on mount + when page changes
//   useEffect(() => {
//     fetchDoctors()
//   }, [currentPage])

//   // ✅ When filters change, apply them to doctors list
//   useEffect(() => {
//     if (!filters || Object.keys(filters).length === 0) {
//       setFilteredDoctors(doctors)
//       return
//     }

//     const filtered = doctors.filter((doc) => {
//       const search = filters.search?.toLowerCase() || ''

//       if (
//         search &&
//         ![doc.name, doc.email, doc.phone]
//           .filter(Boolean)
//           .join(' ')
//           .toLowerCase()
//           .includes(search)
//       )
//         return false

//       if (filters.department && doc.departmentDetails?.department !== filters.department)
//         return false

//       if (filters.service && !(doc.departmentDetails?.services || []).includes(filters.service))
//         return false

//       if (
//         filters.subService &&
//         !(doc.departmentDetails?.subServices || []).includes(filters.subService)
//       )
//         return false

//       if (
//         filters.consultationType &&
//         !(doc.serviceTypes || []).includes(filters.consultationType)
//       )
//         return false

//       if (
//         filters.city &&
//         !doc.offlineAddress?.city?.toLowerCase().includes(filters.city.toLowerCase())
//       )
//         return false

//       if (
//         filters.state &&
//         !doc.offlineAddress?.state?.toLowerCase().includes(filters.state.toLowerCase())
//       )
//         return false

//       return true
//     })

//     setFilteredDoctors(filtered)
//   }, [filters, doctors])

//   // ✅ Receive filters from DoctorsFilter.jsx
//   const handleFilterChange = (newFilters) => {
//     console.log('Received Filters:', newFilters)
//     setFilters(newFilters)
//     setCurrentPage(1)
//   }

//   // ✅ View Profile
//   const handleViewProfile = async (doctor) => {
//     try {
//       const response = await doctorsService.getDoctorById(doctor._id)
//       if (response.status === 'success' && response.data) {
//         setSelectedDoctor(response.data)
//       } else {
//         setError('Failed to fetch doctor details.')
//       }
//     } catch (err) {
//       setError('Failed to fetch doctor details.')
//       console.error('Error fetching doctor details:', err)
//     }
//   }

//   // ✅ View Members
//   const handleViewMembers = async (doctor) => {
//     try {
//       const response = await doctorsService.getDoctorById(doctor.id)
//       if (response.status === 'success' && response.data) {
//         setSelectedDoctor(response.data)
//         setShowAssignedMembers(true)
//       } else {
//         setError('Failed to fetch doctor details.')
//       }
//     } catch (err) {
//       setError('Failed to fetch doctor details.')
//       console.error('Error fetching doctor details:', err)
//     }
//   }

//   return (
//     <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">
//       <DoctorsList
//         doctors={filteredDoctors}
//         isLoading={isLoading}
//         onViewProfile={handleViewProfile}
//         onViewMembers={handleViewMembers}
//         onAddDoctor={() => setShowAddForm(true)}
//         pagination={pagination}
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         onFilterChange={handleFilterChange}
//       />

//       {showAddForm && (
//         <AddEditHospital
//           onClose={() => setShowAddForm(false)}
//           onSuccess={() => {
//             setShowAddForm(false)
//             fetchDoctors() // Refresh list after adding
//           }}
//         />
//       )}

//       {selectedDoctor && !showAssignedMembers && (
//         <DoctorDetail
//           doctor={selectedDoctor}
//           onClose={() => setSelectedDoctor(null)}
//           onDeleteSuccess={() => {
//             setSelectedDoctor(null)
//             fetchDoctors()
//           }}
//         />
//       )}

//       {showAssignedMembers && selectedDoctor && (
//         <AssignedMembersModal
//           isOpen={showAssignedMembers}
//           onClose={() => {
//             setShowAssignedMembers(false)
//             setSelectedDoctor(null)
//           }}
//           doctor={selectedDoctor}
//         />
//       )}

//       {error && <div className="text-red-500 text-center py-4">{error}</div>}
//     </div>
//   )
// }

// export default ShowHospital
// src/components/HealthcareDirectory/hospitals/index.jsx
// src/components/HealthcareDirectory/hospitals/index.jsx

import React, { useEffect, useState, useCallback } from "react";
import HospitalsList from "./HospitalsList";
import AddEditHospital from "./AddEditHospital";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import { healthcareService } from "../../../services/healthcareService";
import { useSnackbar } from "../../../contexts/SnackbarContext";
import { FaPlus } from "react-icons/fa";
import DoctorsFilter from "./DoctorsFilter"; // reuse the doctors filter UI

export default function ShowHospital() {
  const { showSnackbar } = useSnackbar();

  // All hospitals fetched from API
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state (used by DoctorsFilter)
  const [filters, setFilters] = useState({});

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 12;

  // Modal state
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Derived filtered hospitals
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  // Fetch hospitals
  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await healthcareService.getHospitals();
      if (res.status === "success") {
        setHospitals(res.data || []);
      } else {
        showSnackbar("Failed to fetch hospitals", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch hospitals", "error");
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  // Apply filters to hospitals (client-side)
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setFilteredHospitals(hospitals);
      setPage(1);
      return;
    }

    const result = hospitals.filter((h) => {
      const search = filters.search?.toLowerCase() || "";

      if (
        search &&
        ![h.hospitalName, h.email, h.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search)
      ) return false;

      if (filters.city && !h.city?.toLowerCase().includes(filters.city.toLowerCase()))
        return false;

      if (filters.state && !h.state?.toLowerCase().includes(filters.state.toLowerCase()))
        return false;

      // Department / service / subService checks
      if (filters.department) {
        // filter may provide department name(s)
        if (!h.department || !h.department.includes(filters.department)) return false;
      }

      if (filters.service) {
        if (!h.services || !h.services.includes(filters.service)) return false;
      }

      if (filters.subService) {
        if (!h.subServices || !h.subServices.includes(filters.subService)) return false;
      }

      // consultationType may not apply to hospitals but keep compatibility
      if (filters.consultationType) {
        // hospitals typically won't have serviceTypes, so skip or check if present
        if (h.serviceTypes && !h.serviceTypes.includes(filters.consultationType)) return false;
      }

      return true;
    });

    setFilteredHospitals(result);
    setPage(1);
  }, [filters, hospitals]);

  // Handlers
  const openAdd = () => {
    setSelectedHospital(null);
    setShowAddEdit(true);
  };

  const openEdit = (hospital) => {
    setSelectedHospital(hospital);
    setShowAddEdit(true);
  };

  const onSuccessSave = () => {
    setShowAddEdit(false);
    fetchHospitals();
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await healthcareService.deleteHospital(deleteId);
      if (res.status === "success") {
        showSnackbar("Deleted successfully", "success");
        fetchHospitals();
      } else {
        showSnackbar(res.message || "Delete failed", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Delete failed", "error");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil((filteredHospitals.length || 0) / limit));
  const paginated = filteredHospitals.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-4 h-[calc(100vh-80px)] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Hospitals</h2>
        <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <FaPlus /> Add Hospital
        </button>
      </div>

      {/* Filter (reusing DoctorsFilter) */}
      <div className="mb-4">
        <DoctorsFilter
          doctors={hospitals} // DoctorsFilter expects an array prop; it uses it to build filter lists — hospitals works similarly
          onApply={(newFilters) => setFilters(newFilters)}
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto">
        <HospitalsList
          hospitals={paginated}
          isLoading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </div>

      {/* pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 pb-4">
          <button className="px-4 py-2 bg-gray-200 rounded" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span className="text-gray-600">Page {page} of {totalPages}</span>
          <button className="px-4 py-2 bg-gray-200 rounded" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}

      {/* Add/Edit modal */}
      {showAddEdit && (
        <AddEditHospital
          initialData={selectedHospital}
          isEditing={!!selectedHospital}
          onClose={() => setShowAddEdit(false)}
          onSuccess={onSuccessSave}
        />
      )}

      {/* Delete confirm */}
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        title="Delete Hospital"
        message="Are you sure you want to delete this hospital? This action cannot be undone."
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
}

