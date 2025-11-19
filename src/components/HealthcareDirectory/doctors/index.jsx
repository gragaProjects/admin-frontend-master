// import { useState, useEffect } from 'react'
// import { doctorsService } from '../../../services/doctorsService'
// import DoctorsList from './DoctorsList'
// import DoctorDetail from './DoctorDetail'
// import AddEditDoctor from './AddEditDoctor'
// import AssignedMembersModal from './AssignedMembersModal'

// const NewDoctors = () => {
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
//         <AddEditDoctor
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

// export default NewDoctors
import React, { useEffect, useState, useCallback } from "react";
import DoctorsList from "./DoctorsList";
import DoctorsFilter from "./DoctorsFilter";
import AddEditDoctor from "./AddEditDoctor";
import ConfirmationDialog from "../../common/ConfirmationDialog";
import doctorsService from "../../../services/doctorsService";
import { FaPlus } from "react-icons/fa";
import { useSnackbar } from "../../../contexts/SnackbarContext";

export default function NewDoctors() {
  const { showSnackbar } = useSnackbar();

  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 9;

  const [showModal, setShowModal] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Specs loaded from backend
  const [specialties, setSpecialties] = useState([]);
  const [subSpecialties, setSubSpecialties] = useState([]);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await doctorsService.getDoctors();
      if (res.status === "success") {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } else {
        showSnackbar("Failed to load doctors", "error");
      }
    } catch {
      showSnackbar("Failed to load doctors", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Filter Logic
// const applyFilters = (filters) => {
//   let data = doctors;

//   // 🔍 SEARCH (name, email, phone)
//   if (filters.search) {
//     const s = filters.search.toLowerCase();
//     data = data.filter((d) =>
//       `${d.name} ${d.email} ${d.phone}`.toLowerCase().includes(s)
//     );
//   }

//   // 🎯 SPECIALTY
//   if (filters.specialtyId) {
//     data = data.filter((d) => d.specialty === filters.specialtyId);
//   }

//   // 🎯 SUB–SPECIALTY (new schema → "specializations" array)
//   if (filters.subSpecialtyId) {
//     data = data.filter((d) =>
//       d.specializations?.includes(filters.subSpecialtyId)
//     );
//   }

//   // 🎯 CONSULTATION TYPE (online/offline/homeVisit)
//   if (filters.consultationType) {
//     data = data.filter((d) =>
//       d.serviceTypes?.includes(filters.consultationType)
//     );
//   }

//   // 🏙 CITY (inside offlineAddress)
//   if (filters.city) {
//     const c = filters.city.toLowerCase();
//     data = data.filter((d) =>
//       d.offlineAddress?.city?.toLowerCase().includes(c)
//     );
//   }

//   setFilteredDoctors(data);
//   setPage(1);
// };
 // ---------------------------------------------
  // LOAD ALL DOCTORS
  // ---------------------------------------------
  const loadDoctors = async () => {
    const res = await doctorsService.getDoctors();
    if (res?.status === "success") {
      setDoctors(res.data);
      setFilteredDoctors(res.data);
    }
  };

  // ---------------------------------------------
  // LOAD SPECIALTIES
  // ---------------------------------------------
  useEffect(() => {
    async function fetchSpecs() {
      const res = await doctorsService.getSpecialties();
      if (res?.status === "success") setSpecialties(res.data);
    }
    fetchSpecs();
  }, []);

  // ---------------------------------------------
  // LOAD ALL SUB SPECIALTIES (optional but needed for filter)
  // ---------------------------------------------
  useEffect(() => {
    async function fetchSubs() {
      if (!doctorsService.getAllSubSpecialties) return;
      const res = await doctorsService.getAllSubSpecialties();
      if (res?.status === "success") setSubSpecialties(res.data);
    }
    fetchSubs();
  }, []);

  useEffect(() => {
    loadDoctors();
  }, []);

  // ---------------------------------------------
  // APPLY FILTERS — FINAL WORKING VERSION
  // ---------------------------------------------
// const applyFilters = (filters) => {
//   let list = [...doctors];

//   // ---------------------------------------------
//   // 1) SEARCH
//   // ---------------------------------------------
//   if (filters.search) {
//     const s = filters.search.toLowerCase();
//     list = list.filter((d) =>
//       `${d.name} ${d.email} ${d.phone}`
//         .toLowerCase()
//         .includes(s)
//     );
//   }

//   // ---------------------------------------------
//   // 2) SPECIALTY FILTER
//   // doctor.specialty = string ("Cardiology")
//   // ---------------------------------------------
//   if (filters.specialtyId) {
//     const selectedSpec = specialties.find(
//       (x) => String(x._id) === String(filters.specialtyId)
//     );

//     if (selectedSpec) {
//       list = list.filter(
//         (d) =>
//           d.specialty &&
//           d.specialty.toLowerCase() === selectedSpec.name.toLowerCase()
//       );
//     }
//   }

//   // ---------------------------------------------
//   // 3) SUB-SPECIALTY FILTER
//   // doctor.specializations = [ "Electrophysiology (Heart Rhythm Disorders)" ]
//   // ---------------------------------------------
//   if (filters.subSpecialtyId) {
//     const selectedSub = subSpecialties.find(
//       (x) => String(x._id) === String(filters.subSpecialtyId)
//     );

//     if (selectedSub) {
//       list = list.filter((d) =>
//         Array.isArray(d.specializations)
//           ? d.specializations
//               .map((s) => s.toLowerCase())
//               .includes(selectedSub.name.toLowerCase())
//           : false
//       );
//     }
//   }
 

//   // ---------------------------------------------
//   // 4) CONSULTATION TYPE (online/offline/homeVisit)
//   // ---------------------------------------------
//   if (filters.consultationType) {
//     list = list.filter((d) =>
//       Array.isArray(d.serviceTypes)
//         ? d.serviceTypes.includes(filters.consultationType)
//         : false
//     );
//   }

//   // ---------------------------------------------
//   // 5) CITY FILTER (clinic address)
//   // ---------------------------------------------
//   if (filters.city) {
//     const c = filters.city.toLowerCase();
//     list = list.filter((d) =>
//       (d?.offlineAddress?.city || "")
//         .toLowerCase()
//         .includes(c)
//     );
//   }

//   // ------------------------------------------------
//   // UPDATE UI
//   // ------------------------------------------------
//   setFilteredDoctors(list);
//   setPage(1);
// };
const applyFilters = (filters) => {
  const search = filters.search?.toLowerCase() || "";
  const specialtyId = filters.specialtyId || "";
  const subSpecialtyId = filters.subSpecialtyId || "";
  const consultationType = filters.consultationType || "";
  const cityFilter = filters.city?.toLowerCase() || "";

  let result = doctors.filter((d) => {

    // ---------------------------------------------
    // 🔍 SEARCH
    // ---------------------------------------------
    if (
      search &&
      ![d.name, d.email, d.phone]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    ) return false;

    // ---------------------------------------------
    // 🩺 SPECIALTY (MATCH STRING EXACTLY)
    // doctor.specialty = "Cardiology"
    // specialties = [{ _id, name }]
    // ---------------------------------------------
    if (specialtyId) {
      console.log(specialtyId+"     ///specialtyId");
      const spec = specialties.find(s => String(s._id) === String(specialtyId));
      if (!spec) return false;

      if (!d.specialty || d.specialty.toLowerCase() !== spec.name.toLowerCase())
        return false;
    }

    // ---------------------------------------------
    // 🧬 SUB-SPECIALTY (EXACT STRING MATCH)
    // doctor.specializations = ["Interventional", "Heart Failure"]
    // subSpecialties = [{ _id, name }]
    // ---------------------------------------------
    // if (subSpecialtyId) {
    //   console.log(subSpecialtyId+"subSpecialtyId");
      
    //   const sub = subSpecialties.find(s => String(s._id) === String(subSpecialtyId));
    //   console.log("sub");
    //   console.log(sub.name);
      
    //   if (!sub) return false;

    //   if (
    //     !Array.isArray(d.specializations) ||
    //     !d.specializations
    //       .map(s => s.toLowerCase())
    //       .includes(sub.name.toLowerCase())
    //   ) return false;
    // }

    if (subSpecialtyId) {
  const sub = subSpecialties.find(
    s => String(s._id) === String(subSpecialtyId)
  );

  if (!sub) return false;

  const target = sub.name.toLowerCase();

  if (
    !Array.isArray(d.specializations) ||
    !d.specializations.some(s =>
      s.toLowerCase().startsWith(target)
    )
  ) return false;
}


    // ---------------------------------------------
    // 🏥 CONSULTATION TYPE (online/offline/homeVisit)
    // ---------------------------------------------
    if (consultationType) {
      if (!d.serviceTypes?.includes(consultationType)) return false;
    }

    // ---------------------------------------------
    // 🌆 CITY (offlineAddress.city)
    // ---------------------------------------------
    if (cityFilter) {
      if (
        !d.offlineAddress?.city ||
        !d.offlineAddress.city.toLowerCase().includes(cityFilter)
      ) return false;
    }

    return true;
  });

  setFilteredDoctors(result);
  setPage(1);
};
  // Pagination
  const paginated = filteredDoctors.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredDoctors.length / limit);

  // Edit
  const openEdit = (doctor) => {
    setEditDoctor(doctor);
    setShowModal(true);
  };

  // Delete
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await doctorsService.deleteDoctor(deleteId);
      if (res.status === "success") {
        showSnackbar("Doctor deleted", "success");
        fetchDoctors();
      } else showSnackbar("Delete failed", "error");
    } catch {
      showSnackbar("Delete failed", "error");
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  };

  return (
    <div className="p-4 flex flex-col h-[calc(100vh-80px)] overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">Doctors</h2>
        <button
          onClick={() => {
            setEditDoctor(null);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add Doctor
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <DoctorsFilter onApply={applyFilters} />
      </div>

      {/* Doctors List */}
      <div className="flex-1 overflow-auto">
        <DoctorsList
          doctors={paginated}
          isLoading={loading}
          onEdit={openEdit}
          onDelete={confirmDelete}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 py-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Prev
          </button>

          <span>Page {page} / {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Doctor */}
      {showModal && (
        <AddEditDoctor
          initialData={editDoctor}
          isEditing={!!editDoctor}
          onClose={() => setShowModal(false)}
          onSuccess={fetchDoctors}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        isOpen={deleteOpen}
        title="Delete Doctor"
        message="Are you sure?"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isLoading={deleteLoading}
      />
    </div>
  );
}