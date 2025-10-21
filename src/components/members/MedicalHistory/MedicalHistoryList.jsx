import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { medicalHistoryService } from '../../../services/medicalHistoryService';
import ViewMedicalHistory from './ViewMedicalHistory';

const MedicalHistoryList = ({ member, onClose }) => {
  const [medicalHistories, setMedicalHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const fetchMedicalHistories = async () => {
    try {
      setLoading(true);
      const response = await medicalHistoryService.getMedicalHistoryByMemberId(member.id || member._id);
      
      if (response?.data) {
        // If it's a single object, wrap it in an array
        if (Array.isArray(response.data)) {
          setMedicalHistories(response.data);
        } else {
          setMedicalHistories([response.data]);
        }
      } else {
        setMedicalHistories([]);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch medical history');
      console.error('Error fetching medical history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (member) {
      fetchMedicalHistories();
    }
  }, [member]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleHistoryClick = (history) => {
    setSelectedHistory(history);
  };

  const handleHistoryDeleted = () => {
    setSelectedHistory(null); // Close the ViewMedicalHistory modal
    fetchMedicalHistories(); // Refresh the list
  };

  if (selectedHistory) {
    return (
      <ViewMedicalHistory
        member={member}
        onClose={() => setSelectedHistory(null)}
        initialData={selectedHistory}
        onDelete={handleHistoryDeleted}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Medical History - {member?.name || member?.fullName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">
              {error}
            </div>
          ) : medicalHistories.length > 0 ? (
            <div className="grid gap-4">
              {medicalHistories.map((history, index) => (
                <div
                  key={history._id || index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleHistoryClick(history)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {formatDate(history.updatedAt)}
                      </h3>
                      <div className="mt-2 space-y-2">
                        {history.treatingDoctors?.length > 0 && history.treatingDoctors[0].name && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Doctor:</span> {history.treatingDoctors[0].name}
                            {history.treatingDoctors[0].speciality && ` (${history.treatingDoctors[0].speciality})`}
                          </p>
                        )}
                        {history.previousMedicalConditions?.length > 0 && history.previousMedicalConditions[0].condition && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Condition:</span> {history.previousMedicalConditions[0].condition}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created: {formatDate(history.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No medical history records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryList;