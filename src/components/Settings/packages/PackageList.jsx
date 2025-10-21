import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import PackageDetails from './PackageDetails';
import AddPackageForm from './AddPackageForm';
import Modal from '../Modal';
import { packageService } from '../../../services/packageService';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    fetchPackages();
  }, [pagination.currentPage]);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await packageService.getAllPackages(pagination.currentPage);
      
      if (response?.status === 'success' && Array.isArray(response.data)) {
        setPackages(response.data);
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(response.results / 10) || 1
        }));
      } else {
        throw new Error('Invalid response structure: Expected an array of packages');
      }
    } catch (err) {
      setError('Failed to fetch packages. Please try again.');
      console.error('Error fetching packages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (pkg) => {
    setSelectedPackageId(pkg._id);
    setShowDetails(true);
  };

  const handleRefreshList = async () => {
    await fetchPackages();
  };

  const handleAddPackage = async (newPackage) => {
    try {
      await fetchPackages();
      setShowAddForm(false);
    } catch (err) {
      console.error('Error refreshing packages:', err);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-end items-center mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FaPlus size={16} />
          <span>Add Package</span>
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading packages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => fetchPackages()}
                className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-600">No packages found.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
              >
                Add Package
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <div 
                  key={pkg._id} 
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(pkg)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{pkg.title}</h3>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                        ₹{pkg.price}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {pkg.durationInMonths} months
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {pkg.durationInDays} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        pkg.active 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {pkg.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${
                      pagination.currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showDetails && selectedPackageId && (
        <PackageDetails
          packageId={selectedPackageId}
          onClose={() => {
            setShowDetails(false);
            setSelectedPackageId(null);
          }}
          onDelete={handleRefreshList}
        />
      )}

      {showAddForm && (
        <Modal 
          isOpen={true} 
          onClose={() => setShowAddForm(false)} 
          title="Add Package"
        >
          <AddPackageForm
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddPackage}
          />
        </Modal>
      )}
    </div>
  );
};

export default PackageList; 