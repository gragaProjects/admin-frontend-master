import { FaTimes, FaUser, FaSpinner } from 'react-icons/fa';

const SubProfilesModal = ({ member, onClose, loading, onSubProfileSelect }) => {
  const profiles = member?.subProfiles || [];

  console.log('SubProfilesModal - member:', member); // Debug log
  console.log('SubProfilesModal - profiles:', profiles); // Debug log

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
          <div className="flex justify-center items-center h-40">
            <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Sub Profiles</h3>
            <p className="text-sm text-gray-600 mt-1">
              Primary Member: {member?.name || member?.fullName || 'N/A'} (ID: {member?.memberId || 'N/A'})
            </p>
            <p className="text-sm text-gray-500">
              Total Sub Profiles: {profiles.length}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {profiles && profiles.length > 0 ? (
          <div className="grid gap-4">
            {profiles.map((profile) => (
              <div
                key={profile._id}
                className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200 transform hover:scale-[1.01]"
                onClick={() => onSubProfileSelect(profile._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {profile.profilePic ? (
                      <img
                        src={profile.profilePic}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {profile.name || 'N/A'}
                        </h4>
                        <p className="text-sm text-gray-600">ID: {profile.memberId || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">
                          {profile.emergencyContact?.relation || 'N/A'}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          Added: {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="mr-4">Gender: {profile.gender || 'N/A'}</span>
                        <span>Blood Group: {profile.bloodGroup || 'N/A'}</span>
                      </div>
                      {profile.phone && (
                        <div className="text-right">
                          Phone: {profile.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No sub profiles found</p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubProfilesModal; 