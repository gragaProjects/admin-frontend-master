
// import React, { useState, useMemo } from "react";
// import { FaSearch, FaFilter, FaUndo } from "react-icons/fa";
// import { DOCTOR_SPECIALTIES } from "./doctorsData";

// export default function DoctorsPageFilter({ onApply }) {
//     const [search, setSearch] = useState("");
//   const [specialty, setSpecialty] = useState("");
//   const [specialization, setSpecialization] = useState("");
//   const [consultationType, setConsultationType] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");
//   const [area, setArea] = useState("");

//   // Dependent dropdown
//   const specializationOptions = useMemo(() => {
//     if (!specialty) return [];
//     return DOCTOR_SPECIALTIES[specialty] || [];
//   }, [specialty]);

//   const resetAll = () => {
//     setSpecialty("");
//     setSpecialization("");
//     setConsultationType("");
//     setCity("");
//     setState("");
//     setArea("");
//     onApply({});
//   };

//   const applyFilters = () => {
//     onApply({
//       specialty,
//       specialization,
//       consultationType,
//       city: city.trim(),
//       state: state.trim(),
//       area: area.trim(),
//     });
//   };

//   return (
//     <div className="bg-white shadow-sm rounded-xl p-3 mb-4">

//       {/* Responsive Filters */}
//       <div className="flex flex-wrap gap-3 items-center">
//   {/* Search */}
//         <div className="relative w-full sm:w-[48%] lg:w-[300px]">
//           <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search by name, city, area..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
//           />
//         </div>
//         {/* Specialty */}
//         <select
//           value={specialty}
//           onChange={(e) => {
//             setSpecialty(e.target.value);
//             setSpecialization("");
//           }}
//           className="
//             w-full sm:w-[48%] lg:w-[300px]
//             border border-gray-200 rounded-lg px-3 py-2 text-sm
//           "
//         >
//           <option value="">Specialty</option>
//           {Object.keys(DOCTOR_SPECIALTIES).map((sp) => (
//             <option key={sp} value={sp}>{sp}</option>
//           ))}
//         </select>

//         {/* Specialization */}
//         <select
//           value={specialization}
//           onChange={(e) => setSpecialization(e.target.value)}
//           disabled={!specialty}
//           className="
//             w-full sm:w-[48%] lg:w-[300px]
//             border border-gray-200 rounded-lg px-3 py-2 text-sm
//             whitespace-normal break-words
//           "
//         >
//           <option value="">Specialization</option>
//           {specializationOptions.map((sub) => (
//             <option key={sub} value={sub} className="whitespace-normal break-words">
//               {sub}
//             </option>
//           ))}
//         </select>

//         {/* Consultation Type */}
//         <select
//           value={consultationType}
//           onChange={(e) => setConsultationType(e.target.value)}
//           className="
//             w-full sm:w-[48%] lg:w-[300px]
//             border border-gray-200 rounded-lg px-3 py-2 text-sm
//           "
//         >
//           <option value="">Consultation Type</option>
//           <option value="Online Consultation">Online Consultation</option>
//           <option value="Offline Consultation">Offline Consultation</option>
//           <option value="Home Visit">Home Visit</option>
//         </select>

//         {/* City */}
//         <input
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="City"
//           className="
//             w-full sm:w-[48%] lg:w-[300px]
//             border border-gray-200 rounded-lg px-3 py-2 text-sm
//           "
//         />

//         {/* State */}
//         <input
//           value={state}
//           onChange={(e) => setState(e.target.value)}
//           placeholder="State"
//           className="
//             w-full sm:w-[48%] lg:w-[300px]
//             border border-gray-200 rounded-lg px-3 py-2 text-sm
//           "
//         />

//         {/* Area */}
//         <input
//           value={area}
//           onChange={(e) => setArea(e.target.value)}
//           placeholder="Area"
//           className="
//             w-full sm:w-[48%] lg:w-[300px]
//             border border-gray-200 rounded-lg px-3 py-2 text-sm
//           "
//         />


//           <button
//           onClick={resetAll}
//           className="
//             flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 
//             rounded-lg text-sm
//           "
//         >
//           <FaUndo /> Clear
//         </button>

//         <button
//           onClick={applyFilters}
//           className="
//             flex items-center gap-2 bg-[#3ea767] text-white px-4 py-2 
//             rounded-lg text-sm
//           "
//         >
//           <FaFilter /> Apply
//         </button>

//       </div>

//       {/* Buttons */}
//       <div className="flex gap-2 w-full sm:w-auto mt-1 px-3 py-2 ">

      

//       </div>

//     </div>
//   );
// }
// src/components/HealthcareDirectory/doctors/DoctorsPageFilter.jsx
import React, { useState, useEffect } from "react";
import { FaSearch, FaFilter, FaUndo } from "react-icons/fa";
import doctorsService from "../../../services/doctorsService";

export default function DoctorsPageFilter({ onApply }) {
  const [search, setSearch] = useState("");

  const [specialtyId, setSpecialtyId] = useState("");
  const [subSpecialtyId, setSubSpecialtyId] = useState("");

  const [consultationType, setConsultationType] = useState("");
  const [city, setCity] = useState("");

  const [specialties, setSpecialties] = useState([]);
  const [subSpecialties, setSubSpecialties] = useState([]);

  // Load specialties from DB
  useEffect(() => {
    doctorsService.getSpecialties().then((res) => {
      if (res.status === "success") {
        setSpecialties(res.data);
      }
    });
  }, []);

  // Load dependent sub-specialties from DB
  useEffect(() => {
    if (specialtyId) {
      doctorsService.getSubSpecialties(specialtyId).then((res) => {
        if (res.status === "success") {
          setSubSpecialties(res.data);
        }
      });
    } else {
      setSubSpecialties([]);
    }
  }, [specialtyId]);

  // RESET
  const resetAll = () => {
    setSearch("");
    setSpecialtyId("");
    setSubSpecialtyId("");
    setConsultationType("");
    setCity("");

    onApply({});
  };

  // APPLY FILTERS
  const applyFilters = () => {
    onApply({
      search,
      specialtyId,
      subSpecialtyId,
      consultationType,
      city: city.trim(),
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl p-3 mb-4">
      <div className="flex flex-wrap gap-3 items-center">

        {/* SEARCH */}
        <div className="relative w-full sm:w-[48%] lg:w-[300px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctor..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>

        {/* SPECIALTY (DB) */}
        <select
          value={specialtyId}
          onChange={(e) => {
            setSpecialtyId(e.target.value);
            setSubSpecialtyId("");
          }}
          className="w-full sm:w-[48%] lg:w-[300px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Specialty</option>
          {specialties.map((sp) => (
            <option key={sp._id} value={sp._id}>
              {sp.name}
            </option>
          ))}
        </select>

        {/* SUB-SPECIALTY (DB, dependent) */}
        <select
          value={subSpecialtyId}
          onChange={(e) => setSubSpecialtyId(e.target.value)}
          disabled={!specialtyId}
          className="w-full sm:w-[48%] lg:w-[300px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Sub-Specialty</option>
          {subSpecialties.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        {/* CONSULTATION TYPE (Matches backend schema) */}
        <select
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value)}
          className="w-full sm:w-[48%] lg:w-[300px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Consultation Type</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="homeVisit">Home Visit</option>
        </select>

        {/* CITY */}
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full sm:w-[48%] lg:w-[300px] border border-gray-200 rounded-lg px-3 py-2 text-sm"
        />

        {/* CLEAR */}
        <button
          onClick={resetAll}
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm"
        >
          <FaUndo /> Clear
        </button>

        {/* APPLY */}
        <button
          onClick={applyFilters}
          className="flex items-center gap-2 bg-[#3ea767] text-white px-4 py-2 rounded-lg text-sm"
        >
          <FaFilter /> Apply
        </button>
      </div>
    </div>
  );
}
