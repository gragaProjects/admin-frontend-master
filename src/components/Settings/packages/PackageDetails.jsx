import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from '../Modal';
import AddPackageForm from './AddPackageForm';
import { packageService } from '../../../services/packageService';

const PackageDetails = ({ packageId, onClose, onDelete }) => {
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await packageService.getPackageById(packageId);
        
        if (response?.status === 'success' && response?.data) {
          setPackageData(response.data);
        } else {
          throw new Error('Failed to fetch package details');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch package details. Please try again.');
        console.error('Error fetching package details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId]);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleUpdate = async (updatedData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await packageService.updatePackage(packageId, updatedData);
      
      if (response?.status === 'success' && response?.data) {
        setPackageData(response.data);
        setShowEditForm(false);
        if (onDelete) {
          await onDelete();
        }
      } else {
        throw new Error('Failed to update package');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      setError(error.message || 'Failed to update package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await packageService.deletePackage(packageId);
      
      if (response.status === 'success') {
        setShowDeleteConfirm(false);
        if (onDelete) {
          await onDelete();
        }
        onClose();
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      setError('Failed to delete package. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showEditForm) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Edit Package">
        <AddPackageForm
          initialData={packageData}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditForm(false)}
          isEditMode={true}
        />
      </Modal>
    );
  }

  if (showDeleteConfirm) {
    return (
      <Modal isOpen={true} onClose={() => {
        setShowDeleteConfirm(false);
        setError(null);
      }} title="Confirm Delete">
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <FaTrash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Package</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete {packageData?.title}? This action cannot be undone.
            </p>
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Package
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title="Package Details"
      actions={
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit"
          >
            <FaEdit className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : packageData ? (
        <div className="space-y-6 p-4">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{packageData.title}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    ₹{typeof packageData.price === 'number' ? packageData.price.toLocaleString('en-IN') : '0'}
                  </span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                    packageData.active ?? true
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {packageData.active ?? true ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {packageData.code || 'N/A'}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Description</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{packageData.description || 'No description available'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Duration Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Months</p>
                      <p className="text-lg font-medium text-gray-800">
                        {typeof packageData.durationInMonths === 'number' ? `${packageData.durationInMonths} months` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Days</p>
                      <p className="text-lg font-medium text-gray-800">
                        {typeof packageData.durationInDays === 'number' ? `${packageData.durationInDays} days` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Package Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Created On</p>
                      <p className="text-lg font-medium text-gray-800">
                        {packageData.createdAt ? new Date(packageData.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="text-lg font-medium text-gray-800">
                        {packageData.updatedAt ? new Date(packageData.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default PackageDetails; 