import React, { useEffect } from "react";
import { DIAGNOSTIC_SERVICES } from "./diagnosticsData";

export default function DiagnosticsServicesSection({ formData, setFormData }) {
  const toggleService = (service) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((item) => item !== service)
        : [...prev.services, service],
    }));
  };

  return (
    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Diagnostic Services Offered *
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DIAGNOSTIC_SERVICES.map((service) => (
          <label
            key={service}
            className={`flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer ${
              formData.services.includes(service)
                ? "bg-blue-100 border-blue-500"
                : "border-gray-300"
            }`}
          >
            <input
              type="checkbox"
              checked={formData.services.includes(service)}
              onChange={() => toggleService(service)}
            />
            {service}
          </label>
        ))}
      </div>
    </div>
  );
}
