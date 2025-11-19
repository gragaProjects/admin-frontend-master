// src/components/HealthcareDirectory/hospitals/HospitalsList.jsx
import React, { useState } from "react";
import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";

const HospitalsList = ({
  hospitals = [],
  isLoading = false,
  onEdit = () => {},
  onDelete = () => {},
  pagination = { page: 1, pages: 1 },
  currentPage = 1,
  setCurrentPage = () => {}
}) => {
  const [localSelected, setLocalSelected] = useState(null);

  if (isLoading)
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
        Loading hospitals...
      </div>
    );

  if (!hospitals || hospitals.length === 0)
    return <div className="p-4 text-center text-gray-500">No hospitals found</div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {hospitals.map((h) => (
          <div
            key={h._id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                  <FaUserCircle className="w-12 h-12 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {h.hospitalName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-1">{h.email}</p>
                  <p className="text-gray-600 text-sm mb-1">{h.phone}</p>
                  <p className="text-gray-600 text-sm capitalize">
                    {h.area}, {h.city}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100 text-sm text-gray-700">
                <div>
                  <strong>Department:</strong>{" "}
                  {h.department?.length ? h.department.join(", ") : "—"}
                </div>
                <div>
                  <strong>Services:</strong> {h.services?.length ? h.services.join(", ") : "—"}
                </div>
                <div>
                  <strong>Sub Services:</strong>{" "}
                  {h.subServices?.length ? h.subServices.join(", ") : "—"}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(h)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <FaEdit className="w-4 h-4 mr-2" />
                  Edit
                </button>

                <button
                  onClick={() => onDelete(h._id)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  <FaTrash className="w-4 h-4 mr-2" />
                  Delete
                </button>

                <button
                  onClick={() => setLocalSelected(h._id === localSelected ? null : h._id)}
                  className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                >
                  {localSelected === h._id ? "Close" : "View"}
                </button>
              </div>

              {/* Optional expanded section */}
              {localSelected === h._id && (
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Website:</strong> {h.website || "—"}</p>
                  <p><strong>GST:</strong> {h.gstNumber || "—"}</p>
                  <p className="mt-2"><strong>Address:</strong> {h.address}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Simple Pagination */}
      <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className="px-3 py-1 mr-2 border rounded disabled:opacity-50"
          disabled={currentPage <= 1}
        >
          Prev
        </button>
        <div className="px-3 py-1">
          Page {pagination.page} of {pagination.pages}
        </div>
        <button
          onClick={() => currentPage < pagination.pages && setCurrentPage(currentPage + 1)}
          className="px-3 py-1 ml-2 border rounded disabled:opacity-50"
          disabled={currentPage >= pagination.pages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default HospitalsList;
