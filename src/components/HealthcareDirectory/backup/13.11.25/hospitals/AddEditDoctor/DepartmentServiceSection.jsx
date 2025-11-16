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
// src/components/newdoctors/DepartmentServiceSection.jsx
import React, { useEffect, useState } from "react";
import { CATEGORY_DATA } from "../doctorsData";

export default function DepartmentServiceSection({ formData, setFormData }) {

  // -----------------------
  // Build Global Lists
  // -----------------------

  // Department list (independent)
  const DEPARTMENT_LIST = Object.keys(CATEGORY_DATA);

  // Services: merge all services from all departments
  const SERVICES = Array.from(
    new Set(
      Object.values(CATEGORY_DATA).flatMap((d) => d.services || [])
    )
  );

  // Sub-Service map based on service key
  const SUBSERVICES_MAP = {};
  Object.values(CATEGORY_DATA).forEach((dept) => {
    if (dept.subServices) {
      Object.entries(dept.subServices).forEach(([key, subs]) => {
        SUBSERVICES_MAP[key] = subs;
      });
    }
  });

  // -----------------------
  // Local State
  // -----------------------
  const [department, setDepartment] = useState(formData.department || "");
  const [services, setServices] = useState(formData.services || []);
  const [subServices, setSubServices] = useState(formData.subServices || []);

  // Sync with main form
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      department,
      services,
      subServices,
    }));
  }, [department, services, subServices]);

  // -----------------------
  // Toggle Functions
  // -----------------------
  const toggleService = (srv) => {
    setServices((prev) => {
      const updated = prev.includes(srv)
        ? prev.filter((s) => s !== srv)
        : [...prev, srv];

      // remove sub-services of removed service
      const validSubs = updated.flatMap((s) => SUBSERVICES_MAP[s] || []);
      setSubServices((prevSubs) =>
        prevSubs.filter((ss) => validSubs.includes(ss))
      );

      return updated;
    });
  };

  const toggleSubService = (sub) => {
    setSubServices((prev) =>
      prev.includes(sub)
        ? prev.filter((s) => s !== sub)
        : [...prev, sub]
    );
  };

  // Sub-services for selected services
  const availableSubServices = services.flatMap(
    (srv) => SUBSERVICES_MAP[srv] || []
  );

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-4">
        Department, Services & Sub-Services
      </h3>

      {/* Department (Independent) */}
      {/* <label className="block text-sm mb-2">Department *</label>
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-6"
      >
        <option value="">-- Select Department --</option>
        {DEPARTMENT_LIST.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select> */}

      <label className="block text-sm mb-2">Select Departments *</label>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {DEPARTMENT_LIST.map((dept) => (
          <label
            key={dept}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
              (department || []).includes(dept)
                ? "bg-purple-100 border-purple-500"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={(department || []).includes(dept)}
              onChange={() => {
                // toggle logic
                setDepartment((prev) => {
                  const arr = Array.isArray(prev) ? prev : [];
                  return arr.includes(dept)
                    ? arr.filter((d) => d !== dept)
                    : [...arr, dept];
                });
              }}
            />
            {dept}
          </label>
        ))}
      </div>


      {/* Services (Independent) */}
      <label className="block text-sm mb-2">Services *</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {SERVICES.map((srv) => (
          <label
            key={srv}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
              services.includes(srv)
                ? "bg-green-100 border-green-500"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={services.includes(srv)}
              onChange={() => toggleService(srv)}
            />
            {srv}
          </label>
        ))}
      </div>

      {/* Sub-services (Dependent on selected Services) */}
      {services.length > 0 && (
        <>
          <label className="block text-sm mb-2">Sub-Services</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableSubServices.map((sub) => (
              <label
                key={sub}
                className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
                  subServices.includes(sub)
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={subServices.includes(sub)}
                  onChange={() => toggleSubService(sub)}
                />
                {sub}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
