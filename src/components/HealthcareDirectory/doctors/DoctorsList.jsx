// import { useState, useEffect } from 'react'
// import { FaPlus, FaUserMd, FaUserCircle,FaTrash, FaEdit,  } from 'react-icons/fa'
// import DoctorsFilter from './DoctorsFilter'
// import ConfirmationDialog from './ConfirmationDialog'
// const DoctorsList = ({
//   doctors,
//   isLoading,
//   onViewProfile,
//   onViewMembers,
//   onAddDoctor,
//   pagination,
//   currentPage,
//   setCurrentPage,
//   onFilterChange
// }) => {


//     const [isEditing, setIsEditing] = useState(false)
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)//
//   const [isDeleting, setIsDeleting] = useState(false)///
//       const handleEdit = () => {
//     const doctorData = {
//       _id: doctor._id,
//       name: doctor.name,
//       email: doctor.email,
//       phone: doctor.phone,
//       gender: doctor.gender,
//       qualification: doctor.qualification,
//       medicalCouncilRegistrationNumber: doctor.medicalCouncilRegistrationNumber,
//       experienceYears: doctor.experienceYears,
//       languagesSpoken: doctor.languagesSpoken,
//       serviceTypes: doctor.serviceTypes,
//       specializations: doctor.specializations,
//       introduction: doctor.introduction,
//       onlineConsultationTimeSlots: doctor.onlineConsultationTimeSlots,
//       offlineConsultationTimeSlots: doctor.offlineConsultationTimeSlots,
//       offlineAddress: doctor.offlineAddress,
//       areas: doctor.areas,
//       profilePic: doctor.profilePic,
//       digitalSignature: doctor.digitalSignature
//     };
//     setIsEditing(true);
//   };
//   const handleDelete = async () => {
//     try {
//       if (!doctor._id) {
//         showSnackbar('Invalid doctor ID. Please try again.', 'error');
//         return;
//       }
      
//       setIsDeleting(true)
//       const response = await doctorsService.deleteDoctor(doctor._id)
//       console.log('Delete response:', response)
      
//       // Check for success status in response
//       if (response && response.status === 'success') {
//         showSnackbar(response.message || 'Doctor deleted successfully!', 'success')
//         onDeleteSuccess()
//         onClose()
//       } else {
//         throw new Error(response?.message || 'Failed to delete doctor')
//       }
//     } catch (error) {
//       console.error('Error deleting doctor:', error)
//       showSnackbar(error.message || 'Failed to delete doctor', 'error')
//     } finally {
//       setIsDeleting(false)
//       setShowDeleteConfirm(false)
//     }
//   }
//   return (
//     <>
//       <div className="flex flex-col gap-4 mb-6">
//         {/* Add Doctor Button */}
//         <div className="flex justify-end items-center">
//           <button
//             onClick={onAddDoctor}
//             className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//           >
//             <FaPlus />
//             Add Doctor
//           </button>
//         </div>

//         {/* ✅ Unified Filter Section */}
//         <DoctorsFilter doctors={doctors} onApply={onFilterChange} />
//       </div>

//       <div className="flex-1 overflow-auto px-2">
//         {isLoading && (
//           <div className="p-4 text-center text-gray-500">
//             <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
//             Loading doctors...
//           </div>
//         )}

//         {/* Doctor Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
//           {doctors.map((doctor) => (
//             <div
//               key={doctor._id}
//               className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
//             >
//               <div className="p-6 flex flex-col h-full">
//                 {/* Header */}
//                 <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
//                   {doctor.image ? (
//                     <img
//                       src={doctor.image}
//                       alt={doctor.name}
//                       className="w-20 h-20 rounded-full object-cover shadow-sm"
//                     />
//                   ) : (
//                     <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
//                       <FaUserCircle className="w-12 h-12 text-gray-400" />
//                     </div>
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-1">{doctor.name}</h3>
//                     <p className="text-gray-500 text-sm mb-2">ID: {doctor.doctorId}</p>
//                     <p className="text-gray-600 text-sm capitalize mb-2">{doctor.gender}</p>
//                   </div>
//                 </div>

//                 {/* Details */}
//                 <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <FaUserMd className="w-4 h-4 text-blue-500" />
//                     <span className="text-sm truncate">{doctor.education || 'MBBS'}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <span className="text-sm truncate">MCN: {doctor.medicalCouncilRegistrationNumber || 'N/A'}</span>
//                   </div>
//                 </div>

//                 {/* Services & Department */}
//                 {doctor.departmentDetails && (
//                   <div className="text-sm text-gray-700 mb-3">
//                     <p><strong>Dept:</strong> {doctor.departmentDetails.department}</p>
//                     {doctor.departmentDetails.services?.length > 0 && (
//                       <p><strong>Services:</strong> {doctor.departmentDetails.services.join(', ')}</p>
//                     )}
//                     {doctor.departmentDetails.subServices?.length > 0 && (
//                       <p><strong>Sub:</strong> {doctor.departmentDetails.subServices.join(', ')}</p>
//                     )}
//                   </div>
//                 )}

//                 {/* Service Types */}
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {doctor.serviceTypes?.map((type, i) => (
//                     <span
//                       key={i}
//                       className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
//                         type === 'online'
//                           ? 'bg-green-50 text-green-600'
//                           : 'bg-gray-50 text-gray-600'
//                       }`}
//                     >
//                       {type}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Actions */}
//                 {/* 
//                   <button
//                     onClick={() => onViewProfile(doctor)}
//                     className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
//                   >
//                     View Profile
//                   </button>
//                   <button
//                     onClick={() => onViewMembers(doctor)}
//                     className="flex-1 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-sm font-medium transition-colors"
//                   >
//                     View Members
//                   </button>
//                 </div> */}
//                  {/* New */}
//                  <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
//                    <button
//                       onClick={() => setIsEditing(true)}
//                       className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                     >
//                       <FaEdit className="w-4 h-4 mr-2" />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => setShowDeleteConfirm(true)}
//                       className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       <FaTrash className="w-4 h-4 mr-2" />
//                       Delete
//                     </button>

//                       {showDeleteConfirm && (
//             <ConfirmationDialog
//               isOpen={showDeleteConfirm}
//               onClose={() => setShowDeleteConfirm(false)}
//               onConfirm={handleDelete}
//               title="Delete Doctor"
//               message="Are you sure you want to delete this doctor? This action cannot be undone."
//               isLoading={isDeleting}
//             />
//           )}

//           {isEditing && (
//             <AddEditDoctor
//               onClose={() => setIsEditing(false)}
//               initialData={doctor}
//               isEditing={true}
//               onSuccess={() => {
//                 setIsEditing(false);
//                 onClose();
//                 onDeleteSuccess(); // This will refresh the list
//               }}
//             />
//           )}
//               </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Pagination */}
//         {!isLoading && doctors.length > 0 && (
//           <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
//             Page {currentPage} of {pagination.pages}
//           </div>
//         )}
//       </div>
//     </>
//   )
// }

// export default DoctorsList
// src/components/HealthcareDirectory/doctors/DoctorsList.jsx
// src/components/HealthcareDirectory/doctors/DoctorsList.jsx
import React, { useState } from "react";
import { FaEdit, FaTrash, FaUserMd } from "react-icons/fa";

export default function DoctorsList({
  doctors = [],
  isLoading = false,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(null);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin w-6 h-6 border-b-2 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2">Loading doctors...</p>
      </div>
    );
  }

  if (!doctors.length) {
    return <p className="text-center text-gray-500 p-4">No doctors found</p>;
  }
  console.log(doctors);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {doctors.map((d) => (
        <div
          key={d._id}
          className="bg-white border rounded-xl shadow-md p-5 hover:shadow-lg transition"
        >
          {/* Header */}
          <div className="flex gap-4 border-b pb-3 mb-3">
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {d.photoUrl ? (
                <img src={d.photoUrl} className="w-full h-full object-cover" />
              ) : (
                <FaUserMd className="text-4xl text-gray-400" />
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">{d.name}</h3>
              <p className="text-sm text-gray-600">{d.email}</p>
              <p className="text-sm text-gray-600">{d.phone}</p>
            </div>
          </div>

          {/* Short Info */}
          <div className="text-sm text-gray-700 space-y-1">
            
        {d.specialty && (
          <p>
            <strong>Specialty:</strong> {Array.isArray(d.specialty) 
              ? d.specialty.join(", ") 
              : d.specialty}
          </p>
        )}
        {d.specializations && (
          <p>
            <strong>Sub-Specialty:</strong> {Array.isArray(d.specializations) 
              ? d.specializations.join(", ") 
              : d.specializations}
          </p>
        )}
           
            {/* <p><strong>Sub-Specialty:</strong> {d.subSpecialtyId?.name}</p> */}
            <p><strong>Experience:</strong> {d.experienceYears} yrs</p>
            <p><strong>Consultation:</strong> {d.serviceTypes?.join(", ")}</p>
            <p><strong>City:</strong> {d.offlineAddress?.city}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4 border-t pt-3">
            <button
              onClick={() => onEdit(d)}
              className="px-3 py-2 bg-blue-600 text-white text-sm rounded flex items-center gap-2"
            >
              <FaEdit size={14} /> Edit
            </button>

            <button
              onClick={() => onDelete(d._id)}
              className="px-3 py-2 bg-red-600 text-white text-sm rounded flex items-center gap-2"
            >
              <FaTrash size={14} /> Delete
            </button>

            <button
              onClick={() => setExpanded(expanded === d._id ? null : d._id)}
              className="ml-auto text-gray-600 hover:text-gray-800 text-sm"
            >
              {expanded === d._id ? "Close" : "View"}
            </button>
          </div>

          {/* Expanded */}
          {expanded === d._id && (
            <div className="mt-3 pt-3 border-t text-sm text-gray-700 space-y-2 animate-fadeIn">
              <p><strong>Qualification:</strong> {d.qualification}</p>
              <p><strong>MCN:</strong> {d.medicalCouncilRegistrationNumber}</p>
              {/* <p><strong>Clinic:</strong> {d.clinicName}</p> */}
             {d.offlineAddress && (
              <p>
                <strong>Address:</strong>{" "}
                {[
                  d.offlineAddress.description,
                  d.offlineAddress.landmark,
                  d.offlineAddress.region,
                  d.offlineAddress.city,
                  d.offlineAddress.state,
                  d.offlineAddress.pinCode,
                  d.offlineAddress.country
                ].filter(Boolean).join(", ")}
              </p>
            )}

              {/* <p><strong>Bio:</strong> {d.bio}</p> */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}