import { FaPlus, FaUserMd, FaUserCircle } from 'react-icons/fa'
import DoctorsFilter from './DoctorsFilter'

const DoctorsList = ({
  doctors,
  isLoading,
  onViewProfile,
  onViewMembers,
  onAddDoctor,
  pagination,
  currentPage,
  setCurrentPage,
  onFilterChange
}) => {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        {/* Add Doctor Button */}
        <div className="flex justify-end items-center">
          <button
            onClick={onAddDoctor}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus />
            Add Hospital
          </button>
        </div>

        {/* ✅ Unified Filter Section */}
        <DoctorsFilter doctors={doctors} onApply={onFilterChange} />
      </div>

      <div className="flex-1 overflow-auto px-2">
        {isLoading && (
          <div className="p-4 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-2"></div>
            Loading doctors...
          </div>
        )}

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaUserCircle className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{doctor.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">ID: {doctor.doctorId}</p>
                    <p className="text-gray-600 text-sm capitalize mb-2">{doctor.gender}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUserMd className="w-4 h-4 text-blue-500" />
                    <span className="text-sm truncate">{doctor.education || 'MBBS'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm truncate">MCN: {doctor.medicalCouncilRegistrationNumber || 'N/A'}</span>
                  </div>
                </div>

                {/* Services & Department */}
                {doctor.departmentDetails && (
                  <div className="text-sm text-gray-700 mb-3">
                    <p><strong>Dept:</strong> {doctor.departmentDetails.department}</p>
                    {doctor.departmentDetails.services?.length > 0 && (
                      <p><strong>Services:</strong> {doctor.departmentDetails.services.join(', ')}</p>
                    )}
                    {doctor.departmentDetails.subServices?.length > 0 && (
                      <p><strong>Sub:</strong> {doctor.departmentDetails.subServices.join(', ')}</p>
                    )}
                  </div>
                )}

                {/* Service Types */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {doctor.serviceTypes?.map((type, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize ${
                        type === 'online'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                  <button
                    onClick={() => onViewProfile(doctor)}
                    className="flex-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onViewMembers(doctor)}
                    className="flex-1 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Members
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!isLoading && doctors.length > 0 && (
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            Page {currentPage} of {pagination.pages}
          </div>
        )}
      </div>
    </>
  )
}

export default DoctorsList
