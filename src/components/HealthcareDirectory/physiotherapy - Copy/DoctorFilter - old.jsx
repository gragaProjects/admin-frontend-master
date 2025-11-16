// import { useState, useEffect } from 'react';
// import { FaTimes } from 'react-icons/fa';

// // Define service types as constants to avoid typos
// const SERVICE_TYPES = {
//   ALL: 'all',
//   ONLINE: 'online',
//   OFFLINE: 'offline'
// };

// const DoctorFilter = ({ 
//   showFilters,
//   selectedServiceType,
//   setSelectedServiceType,
//   onClose,
//   setSearchTerm,
//   searchTerm = '',
//   doctorId = '',
//   setDoctorId,
//   pincode = '',
//   setPincode,
//   onFilterChange
// }) => {
//   // Add temporary state for filters
//   const [tempSearchTerm, setTempSearchTerm] = useState(searchTerm);
//   const [tempDoctorId, setTempDoctorId] = useState(doctorId);
//   const [tempPincode, setTempPincode] = useState(pincode);
//   const [tempServiceType, setTempServiceType] = useState(selectedServiceType || SERVICE_TYPES.ALL);

//   // Update temporary state when props change
//   useEffect(() => {
//     setTempSearchTerm(searchTerm);
//     setTempDoctorId(doctorId);
//     setTempPincode(pincode);
//     setTempServiceType(selectedServiceType || SERVICE_TYPES.ALL);
//   }, [searchTerm, doctorId, pincode, selectedServiceType]);

//   const hasActiveFilters = tempServiceType !== SERVICE_TYPES.ALL || tempSearchTerm || tempDoctorId || tempPincode;

//   const handleClearFilters = () => {
//     const clearedValues = {
//       searchTerm: '',
//       doctorId: '',
//       pincode: '',
//       serviceType: SERVICE_TYPES.ALL
//     };
//     setTempSearchTerm(clearedValues.searchTerm);
//     setTempDoctorId(clearedValues.doctorId);
//     setTempPincode(clearedValues.pincode);
//     setTempServiceType(clearedValues.serviceType);
    
//     // Apply cleared filters immediately
//     onFilterChange(
//       clearedValues.searchTerm,
//       clearedValues.doctorId,
//       clearedValues.pincode,
//       clearedValues.serviceType
//     );
//     onClose();
//   };

//   const handleApplyFilters = () => {
//     // Only pass the service type if it's not 'all'
//     const serviceTypeToPass = tempServiceType === SERVICE_TYPES.ALL ? undefined : tempServiceType;
//     console.log('DoctorFilter - Applying filters:', {
//       searchTerm: tempSearchTerm,
//       doctorId: tempDoctorId,
//       pincode: tempPincode,
//       serviceType: serviceTypeToPass
//     });
//     onFilterChange(tempSearchTerm, tempDoctorId, tempPincode, serviceTypeToPass);
//     onClose();
//   };

//   if (!showFilters) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//         {/* Background overlay */}
//         <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

//         {/* Filter Panel */}
//         <div className="relative inline-block w-full max-w-md my-4 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl sm:align-middle sm:max-w-lg">
//           <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
//             {/* Header with close button */}
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//               <h3 className="text-xl font-semibold text-gray-900">Filters</h3>
//               <div className="flex items-center gap-4">
//                 {hasActiveFilters && (
//                   <button
//                     onClick={handleClearFilters}
//                     className="text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     Clear all filters
//                   </button>
//                 )}
//                 <button
//                   onClick={onClose}
//                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 >
//                   <FaTimes className="w-5 h-5 text-gray-500" />
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {/* Name Filter */}
//               <div className="mb-8">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">Doctor Name</h4>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={tempSearchTerm}
//                     onChange={(e) => setTempSearchTerm(e.target.value)}
//                     placeholder="Search by doctor name..."
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Doctor ID Filter */}
//               <div className="mb-8">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">Doctor ID</h4>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={tempDoctorId}
//                     onChange={(e) => setTempDoctorId(e.target.value)}
//                     placeholder="Enter doctor ID..."
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Service Type Filter */}
//               <div className="mb-8">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">Service Type</h4>
//                 <div className="grid grid-cols-3 gap-3">
//                   {Object.values(SERVICE_TYPES).map((type) => (
//                     <button
//                       key={type}
//                       onClick={() => {
//                         console.log('Setting service type to:', type);
//                         setTempServiceType(type);
//                       }}
//                       className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
//                         tempServiceType === type
//                           ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
//                           : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
//                       }`}
//                     >
//                       {type.charAt(0).toUpperCase() + type.slice(1)}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Pincode Filter */}
//               <div className="mb-8">
//                 <h4 className="text-sm font-medium text-gray-700 mb-3">Pincode</h4>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={tempPincode}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, ''); // Only allow digits
//                       if (value.length <= 6) {
//                         setTempPincode(value);
//                       }
//                     }}
//                     placeholder="Enter pincode..."
//                     maxLength={6}
//                     pattern="[0-9]*"
//                     inputMode="numeric"
//                     className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               {/* Apply Filters Button */}
//               <div className="mt-8">
//                 <button
//                   onClick={handleApplyFilters}
//                   className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   Apply Filters
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DoctorFilter; 

import React, { useMemo, useState } from 'react';
import { CATEGORY_DATA } from './doctorsData';
import { FaSearch, FaFilter, FaUndo } from 'react-icons/fa';

export default function DoctorsFilter({ onApply }) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [service, setService] = useState('');
  const [subService, setSubService] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Dynamic options
  const serviceOptions = useMemo(() => {
    if (!department) return [];
    return CATEGORY_DATA[department]?.services || [];
  }, [department]);

  const subServiceOptions = useMemo(() => {
    if (!department || !service) return [];
    return CATEGORY_DATA[department]?.subServices?.[service] || [];
  }, [department, service]);

  const resetAll = () => {
    setSearch('');
    setDepartment('');
    setService('');
    setSubService('');
    setCity('');
    setState('');
    onApply({});
  };

  const applyFilters = () => {
    onApply({
      search: search.trim(),
      department,
      service,
      subService,
      city: city.trim(),
      state: state.trim(),
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 mb-4 border border-gray-100">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3ea767] outline-none text-sm"
          />
        </div>

        {/* Department */}
        <select
          value={department}
          onChange={(e) => {
            setDepartment(e.target.value);
            setService('');
            setSubService('');
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
        >
          <option value="">Department</option>
          {Object.keys(CATEGORY_DATA).map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Service */}
        <select
          value={service}
          onChange={(e) => {
            setService(e.target.value);
            setSubService('');
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
          disabled={!department}
        >
          <option value="">Service</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Sub-Service */}
        <select
          value={subService}
          onChange={(e) => setSubService(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
          disabled={!service}
        >
          <option value="">Sub-Service</option>
          {subServiceOptions.map((ss) => (
            <option key={ss} value={ss}>
              {ss}
            </option>
          ))}
        </select>

        {/* City */}
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[140px]"
        />

        {/* State */}
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[140px]"
        />

        {/* Buttons */}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
          >
            <FaUndo className="text-gray-500" /> Clear
          </button>

          <button
            type="button"
            onClick={applyFilters}
            className="flex items-center gap-2 bg-[#3ea767] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#35965c] transition"
          >
            <FaFilter /> Apply
          </button>
        </div>
      </div>
    </div>
  );
}

