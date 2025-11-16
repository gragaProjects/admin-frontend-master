
import React, { useState, useEffect } from "react";
import { PHYSIOTHERAPY_SERVICES } from "../PhysiotherapyData";

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

