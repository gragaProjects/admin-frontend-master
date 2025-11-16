// // src/components/newdoctors/DepartmentServiceSection.jsx
// import React, { useState, useEffect } from 'react';
// import { CATEGORY_DATA } from '../doctorsData';
// import { FaCheckCircle } from 'react-icons/fa';

// export default function DepartmentServiceSection({ formData, setFormData }) {
//   const [department, setDepartment] = useState(formData.departmentDetails?.department || '');
//   const [services, setServices] = useState(formData.departmentDetails?.services || []);
//   const [subServices, setSubServices] = useState(formData.departmentDetails?.subServices || []);

//   // Update parent formData whenever something changes
//   useEffect(() => {
//     setFormData((prev) => ({
//       ...prev,
//       departmentDetails: { department, services, subServices },
//     }));
//   }, [department, services, subServices, setFormData]);

//   const handleServiceToggle = (service) => {
//     setServices((prev) =>
//       prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
//     );
//   };

//   const handleSubServiceToggle = (sub) => {
//     setSubServices((prev) =>
//       prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
//     );
//   };

//   const currentDept = CATEGORY_DATA[department] || {};
//   const currentServices = currentDept.services || [];
//   const currentSubServices = services.flatMap(
//     (s) => currentDept.subServices?.[s.replace(/\s+/g, '')] || []
//   );

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//         <span className="w-2.5 h-2.5 bg-[#3ea767] rounded-full"></span>
//         Department, Services & Sub-services
//       </h3>

//       {/* Department Selection */}
//       <div className="mb-5">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Select Department
//         </label>
//         <select
//           value={department}
//           onChange={(e) => {
//             setDepartment(e.target.value);
//             setServices([]);
//             setSubServices([]);
//           }}
//           className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#3ea767] focus:outline-none"
//         >
//           <option value="">-- Select Department --</option>
//           {Object.keys(CATEGORY_DATA).map((dept) => (
//             <option key={dept} value={dept}>
//               {dept}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Services */}
//       {department && currentServices.length > 0 && (
//         <div className="mb-5">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Select Services
//           </label>
//           <div className="flex flex-wrap gap-4">
//             {currentServices.map((service) => (
//               <label
//                 key={service}
//                 className={`flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-1.5 text-sm ${
//                   services.includes(service)
//                     ? 'bg-[#3ea767]/10 border-[#3ea767] text-[#3ea767]'
//                     : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={services.includes(service)}
//                   onChange={() => handleServiceToggle(service)}
//                 />
//                 {service}
//               </label>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Sub-services */}
//       {services.length > 0 && currentSubServices.length > 0 && (
//         <div className="mb-5">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Select Sub-services
//           </label>
//           <div className="flex flex-wrap gap-4">
//             {currentSubServices.map((sub) => (
//               <label
//                 key={sub}
//                 className={`flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-1.5 text-sm ${
//                   subServices.includes(sub)
//                     ? 'bg-[#3ea767]/10 border-[#3ea767] text-[#3ea767]'
//                     : 'border-gray-300 text-gray-700 hover:bg-gray-50'
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={subServices.includes(sub)}
//                   onChange={() => handleSubServiceToggle(sub)}
//                 />
//                 {sub}
//               </label>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Summary Section */}
//       {(department || services.length > 0 || subServices.length > 0) && (
//         <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
//           <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
//             <FaCheckCircle className="text-[#3ea767]" /> Selected Summary
//           </h4>
//           <div className="text-sm text-gray-700 space-y-2">
//             {department && (
//               <p>
//                 <span className="font-medium text-gray-800">Department:</span>{' '}
//                 {department}
//               </p>
//             )}
//             {services.length > 0 && (
//               <div>
//                 <span className="font-medium text-gray-800">Services:</span>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {services.map((s) => (
//                     <span
//                       key={s}
//                       className="bg-[#3ea767]/10 text-[#3ea767] px-2 py-1 rounded-md text-xs"
//                     >
//                       {s}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//             {subServices.length > 0 && (
//               <div>
//                 <span className="font-medium text-gray-800">Sub-services:</span>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {subServices.map((ss) => (
//                     <span
//                       key={ss}
//                       className="bg-[#3ea767]/5 border border-[#3ea767]/40 text-[#3ea767] px-2 py-1 rounded-md text-xs"
//                     >
//                       {ss}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { DOCTOR_SPECIALTIES } from "../doctorsData";

export default function DepartmentServiceSection({ formData, setFormData }) {
  const [specialty, setSpecialty] = useState(formData.specialty || "");
  const [specializations, setSpecializations] = useState(
    formData.specializations || []
  );

  // Update formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      specialty,
      specializations,
    }));
  }, [specialty, specializations]);

  const toggleSpecialization = (item) => {
    setSpecializations((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Specialty & Specialization
      </h3>

      {/* Specialty */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Specialty *
        </label>

        <select
          value={specialty}
          onChange={(e) => {
            setSpecialty(e.target.value);
            setSpecializations([]); // reset when change specialty
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 w-full"
        >
          <option value="">-- Select Specialty --</option>
          {Object.keys(DOCTOR_SPECIALTIES).map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* Specialization */}
      {specialty && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialization *
          </label>

          <div className="flex flex-wrap gap-3">
            {DOCTOR_SPECIALTIES[specialty].map((item) => (
              <label
                key={item}
                className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 cursor-pointer ${
                  specializations.includes(item)
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={specializations.includes(item)}
                  onChange={() => toggleSpecialization(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

