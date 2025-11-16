// // src/components/newdoctors/DoctorsFilter.jsx
// import React, { useMemo, useState } from 'react';
// import { SPECIALIZATION_MAP } from './doctorsData';
// import { FaSearch, FaFilter, FaUndo } from 'react-icons/fa';

// export default function DoctorsFilter({ onApply }) {
//   const [search, setSearch] = useState('');
//   const [specialty, setSpecialty] = useState('');
//   const [specialization, setSpecialization] = useState('');
//   const [consultationType, setConsultationType] = useState('');
//   const [city, setCity] = useState('');
//   const [state, setState] = useState('');

//   const specializationOptions = useMemo(() => {
//     if (specialty && SPECIALIZATION_MAP[specialty]) return SPECIALIZATION_MAP[specialty];
//     const all = new Set();
//     Object.values(SPECIALIZATION_MAP).forEach(arr => arr.forEach(s => all.add(s)));
//     return Array.from(all);
//   }, [specialty]);

//   const resetAll = () => {
//     setSearch('');
//     setSpecialty('');
//     setSpecialization('');
//     setConsultationType('');
//     setCity('');
//     setState('');
//     onApply({});
//   };

//   const applyFilters = () => {
//     onApply({
//       search: search.trim(),
//       specialty,
//       specialization,
//       consultationType,
//       city: city.trim(),
//       state: state.trim(),
//     });
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-xl p-4 mb-4">
//       <div className="flex flex-wrap gap-3 items-center">
//         {/* Search */}
//         <div className="relative flex-1 min-w-[220px]">
//           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, city, area, email..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3ea767] outline-none text-sm"
//           />
//         </div>

//         {/* Specialty */}
//         <select
//           value={specialty}
//           onChange={(e) => { setSpecialty(e.target.value); setSpecialization(''); }}
//           className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
//         >
//           <option value="">Specialty</option>
//           {Object.keys(SPECIALIZATION_MAP).map(s => (
//             <option key={s} value={s}>{s}</option>
//           ))}
//         </select>

//         {/* Specialization */}
//         <select
//           value={specialization}
//           onChange={(e) => setSpecialization(e.target.value)}
//           className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
//         >
//           <option value="">Specialization</option>
//           {specializationOptions.map(sp => <option key={sp} value={sp}>{sp}</option>)}
//         </select>

//         {/* Consultation Type */}
//         <select
//           value={consultationType}
//           onChange={(e) => setConsultationType(e.target.value)}
//           className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
//         >
//           <option value="">Consultation Type</option>
//           <option value="Online Consultation">Online</option>
//           <option value="Offline Consultation">Offline</option>
//           <option value="Home Visit">Home Visit</option>
//         </select>

//         {/* City */}
//         <input
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="City"
//           className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[140px]"
//         />

//         {/* State */}
//         <input
//           value={state}
//           onChange={(e) => setState(e.target.value)}
//           placeholder="State"
//           className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[140px]"
//         />

//         {/* Buttons */}
//         <div className="ml-auto flex gap-2">
//           <button
//             type="button"
//             onClick={resetAll}
//             className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
//           >
//             <FaUndo className="text-gray-500" /> Clear
//           </button>

//           <button
//             type="button"
//             onClick={applyFilters}
//             className="flex items-center gap-2 bg-[#3ea767] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#35965c] transition"
//           >
//             <FaFilter /> Apply
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useMemo, useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaUndo } from 'react-icons/fa';
import { CATEGORY_DATA } from './doctorsData'; // static data fallback

export default function DoctorsFilter({ doctors = [], onApply }) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [service, setService] = useState('');
  const [subService, setSubService] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // 🧠 Dynamic DB-based options (combine DB + static)
  const allDepartments = useMemo(() => {
    const dbDepartments = Array.from(
      new Set(
        doctors
          .map(d => d.departmentDetails?.department)
          .filter(Boolean)
      )
    );
    const staticDepartments = Object.keys(CATEGORY_DATA);
    return Array.from(new Set([...dbDepartments, ...staticDepartments]));
  }, [doctors]);

  // const allServices = useMemo(() => {
  //   let dbServices = [];
  //   doctors.forEach(d => {
  //     if (Array.isArray(d.departmentDetails?.services)) {
  //       dbServices.push(...d.departmentDetails.services);
  //     }
  //   });
  //   const staticServices = department ? CATEGORY_DATA[department]?.services || [] : [];
  //   return Array.from(new Set([...dbServices, ...staticServices]));
  // }, [doctors, department]);

  // const allSubServices = useMemo(() => {
  //   let dbSubServices = [];
  //   doctors.forEach(d => {
  //     if (Array.isArray(d.departmentDetails?.subServices)) {
  //       dbSubServices.push(...d.departmentDetails.subServices);
  //     }
  //   });
  //   const staticSubServices = department ? CATEGORY_DATA[department]?.subServices || [] : [];
  //   return Array.from(new Set([...dbSubServices, ...staticSubServices]));
  // }, [doctors, department]);
// inside DoctorsFilter component (after `department` and `doctors` exist)
// ✅ Services (combine DB + static safely)
const allServices = useMemo(() => {
  const dbServices = [];

  (doctors || []).forEach(d => {
    if (Array.isArray(d?.departmentDetails?.services)) {
      dbServices.push(...d.departmentDetails.services);
    }
  });

  const staticServices = Array.isArray(CATEGORY_DATA[department]?.services)
    ? CATEGORY_DATA[department].services
    : [];

  return Array.from(new Set([ ...staticServices, ...dbServices ]));
}, [doctors, department]);

// ✅ Sub-Services (combine DB + static safely)
const allSubServices = useMemo(() => {
  const dbSubServices = [];

  (doctors || []).forEach(d => {
    if (Array.isArray(d?.departmentDetails?.subServices)) {
      dbSubServices.push(...d.departmentDetails.subServices);
    }
  });

  const staticSubServices = Array.isArray(CATEGORY_DATA[department]?.subServices)
    ? CATEGORY_DATA[department].subServices
    : [];

  return Array.from(new Set([ ...staticSubServices, ...dbSubServices ]));
}, [doctors, department]);
  const resetAll = () => {
    setSearch('');
    setDepartment('');
    setService('');
    setSubService('');
    setConsultationType('');
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
      consultationType,
      city: city.trim(),
      state: state.trim(),
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-4 mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, city, area, email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3ea767] outline-none text-sm"
          />
        </div>

        {/* Department */}
        <select
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setService(''); setSubService(''); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
        >
          <option value="">Department</option>
          {allDepartments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        {/* Service */}
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
          disabled={!department}
        >
          <option value="">Service</option>
          {allServices.map((srv) => (
            <option key={srv} value={srv}>{srv}</option>
          ))}
        </select>

        {/* Sub-Service */}
      <select
  value={subService}
  onChange={(e) => setSubService(e.target.value)}
  disabled={!department}
  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
>
  <option value="">Sub-Service</option>
  {allSubServices.map(sub => (
    <option key={sub} value={sub}>{sub}</option>
  ))}
</select>

        {/* Consultation Type */}
        <select
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[160px]"
        >
          <option value="">Consultation Type</option>
          <option value="Online Consultation">Online</option>
          <option value="Offline Consultation">Offline</option>
          <option value="Home Visit">Home Visit</option>
        </select>

        {/* City */}
        {/* <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[140px]"
        /> */}

        {/* State */}
        {/* <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#3ea767] outline-none min-w-[140px]"
        /> */}

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
