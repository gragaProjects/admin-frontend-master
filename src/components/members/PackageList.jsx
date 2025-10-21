import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { packageService } from '../../services/packageService';
import { membersService } from '../../services/membersService';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, package: pkg, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Package Addition</h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Package:</span>
              <span>{pkg.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Duration:</span>
              <span>{pkg.durationInDays} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Price:</span>
              <span className="text-green-600">₹{pkg.price}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-6">Are you sure you want to add this package?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(pkg)}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PackageList = ({ isOpen, onClose, onSelect, memberId }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addingPackage, setAddingPackage] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await packageService.getAllPackages();
        if (response.status === 'success') {
          setPackages(response.data || []);
        } else {
          throw new Error('Failed to fetch packages');
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowConfirmation(true);
  };

  const handleConfirm = async (pkg) => {
    try {
      setAddingPackage(true);
      setError(null);
      
      // Validate required data
      if (!memberId) {
        throw new Error('Member ID is missing');
      }
      if (!pkg._id) {
        throw new Error('Package ID is missing');
      }

      console.log('Adding package subscription with:', {
        memberId,
        packageId: pkg._id,
        packageDetails: pkg
      });
      
      // First add the package subscription
      const subscriptionResponse = await membersService.addPackageSubscription(memberId, pkg._id, pkg);
      
      if (subscriptionResponse.status !== 'success') {
        throw new Error(subscriptionResponse.message || 'Failed to add package subscription');
      }

      console.log('Package subscription added successfully:', subscriptionResponse);
      
      // Then fetch the updated subscription data
      const updatedSubscription = await membersService.getMemberSubscriptions(memberId);
      
      if (updatedSubscription.status === 'success') {
        // Close both modals and notify parent to refresh with latest data
        setShowConfirmation(false);
        setSelectedPackage(null);
        onSelect(updatedSubscription.data); // Pass the complete updated subscription data
        onClose();
      } else {
        throw new Error('Failed to fetch updated subscription data');
      }
    } catch (error) {
      console.error('Error adding package:', error);
      // Show more detailed error message
      setError(error.response?.data?.message || error.message || 'Failed to add package');
    } finally {
      setAddingPackage(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(false);
    setSelectedPackage(null);
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[80vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Select Package</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="m-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="p-4 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No packages available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    onClick={() => handlePackageClick(pkg)}
                    className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">{pkg.title}</h4>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {pkg.packageCode}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{pkg.durationInDays} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium text-green-600">₹{pkg.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleClose}
        onConfirm={handleConfirm}
        package={selectedPackage}
        loading={addingPackage}
      />
    </>
  );
};

export default PackageList; 