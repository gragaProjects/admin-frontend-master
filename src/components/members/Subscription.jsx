import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaCrown, FaHistory, FaBox, FaPlus, FaSpinner } from 'react-icons/fa';
import { packageService } from '../../services/packageService';
import PackageList from './PackageList';
import { membersService } from '../../services/membersService';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
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

const Subscription = ({ isOpen, onClose, member }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showPackageList, setShowPackageList] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!isOpen || !member?._id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await membersService.getMemberSubscriptions(member._id);
        if (response.status === 'success') {
          setSubscriptionData(response.data);
        } else {
          throw new Error('Failed to fetch subscription data');
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        setError(error.message || 'Failed to fetch subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [isOpen, member?._id]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleActivateSubscription = () => {
    setShowConfirmation(true);
  };

  const handleConfirmActivation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await membersService.renewMembership(member._id);
      
      if (response.status === 'success' && response.data) {
        // Fetch the complete updated subscription data
        const updatedSubscription = await membersService.getMemberSubscriptions(member._id);
        if (updatedSubscription.status === 'success') {
          setSubscriptionData(updatedSubscription.data);
        }
        setShowConfirmation(false);
      } else {
        throw new Error(response.message || 'Failed to activate membership');
      }
    } catch (error) {
      console.error('Error activating membership:', error);
      setError(error.message || 'Failed to activate membership');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPackage = () => {
    setShowPackageList(true);
  };

  const handlePackageSelect = async (updatedData) => {
    // Update subscription data with the latest data
    setSubscriptionData(updatedData);
    setShowPackageList(false);
  };

  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    
    // Reset hours to start of day for accurate day calculation
    now.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const getDaysRemainingClass = (daysRemaining) => {
    if (daysRemaining > 30) return 'bg-green-100 text-green-800';
    if (daysRemaining > 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!isOpen) return null;

  // Early loading state
  if (loading && !subscriptionData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  // Use the fetched subscription data
  const membershipStatus = subscriptionData?.membershipStatus || {};
  const premiumMembership = membershipStatus.premiumMembership || {};
  const packages = subscriptionData?.packages || [];
  const history = subscriptionData?.history || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Subscription Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Member Info Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {member?.name || 'N/A'}
              </h3>
              <span className="px-3 py-1 text-sm text-white bg-blue-500 rounded-full">
                Member ID: {subscriptionData?.memberId}
              </span>
            </div>

            {/* Current Subscriptions Section */}
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="px-4 py-3 border-b bg-gray-50">
                <h4 className="text-base font-semibold text-gray-800">Current Subscriptions</h4>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Active Packages */}
                {subscriptionData?.packages && subscriptionData.packages.length > 0 && (
                  <div className="border border-blue-200 rounded-lg bg-blue-50 p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaBox className="w-5 h-5 text-blue-500" />
                        <h5 className="font-medium text-blue-800">Active Packages</h5>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {subscriptionData.packages.length} package{subscriptionData.packages.length > 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={handleAddPackage}
                          className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                        >
                          <FaPlus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {subscriptionData.packages.map((pkg, index) => (
                        <div key={pkg.transactionId} 
                             className="bg-white rounded-lg p-4 space-y-3 border border-blue-100">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">{pkg.packageName}</span>
                            <span className="text-sm text-gray-500">Code: {pkg.packageCode}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Start Date:</span>
                              <span className="ml-2 text-gray-900">{formatDate(pkg.startDate)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Expiry Date:</span>
                              <span className="ml-2 text-gray-900">{formatDate(pkg.expiryDate)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Amount Paid:</span>
                              <span className="ml-2 text-gray-900">{formatCurrency(pkg.finalAmountPaid)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Transaction ID:</span>
                              <span className="ml-2 text-gray-900">{pkg.transactionId}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show empty state with add button if no packages */}
                {subscriptionData?.packages && subscriptionData.packages.length === 0 && (
                  <div className="border border-blue-200 rounded-lg bg-blue-50 p-8 text-center">
                    <FaBox className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                    <h5 className="font-medium text-blue-800 mb-2">No Active Packages</h5>
                    <p className="text-blue-600 mb-4">Add a package to get started</p>
                    <button
                      onClick={handleAddPackage}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors mx-auto"
                    >
                      <FaPlus className="w-4 h-4" />
                      <span>Add Package</span>
                    </button>
                  </div>
                )}

                {/* Registration Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Registration Status</span>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                    Registered
                  </span>
                </div>

                {/* Registration Date */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Registration Date</span>
                  <span className="text-gray-600">
                    {formatDate(membershipStatus.registrationDate)}
                  </span>
                </div>

                {/* Premium Membership Status */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaCrown className={`w-5 h-5 ${premiumMembership.isActive ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <span className="font-medium">Premium Status</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      premiumMembership.isActive ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {premiumMembership.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {!premiumMembership.isActive && (
                      <button
                        onClick={handleActivateSubscription}
                        className="px-4 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>

                {/* Premium Details Section - Only show if active */}
                {premiumMembership.isActive && (
                  <div className="border border-yellow-200 rounded-lg bg-yellow-50 p-4 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="font-medium">Premium Start Date</span>
                      <span className="text-gray-600">
                        {formatDate(premiumMembership.startDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="font-medium">Premium Expiry Date</span>
                      <span className="text-gray-600">
                        {formatDate(premiumMembership.expiryDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="font-medium">Renewal Count</span>
                      <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {premiumMembership.renewalCount} time(s)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <span className="font-medium">Days Remaining</span>
                      {premiumMembership.expiryDate && (
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            getDaysRemainingClass(calculateDaysRemaining(premiumMembership.expiryDate))
                          }`}>
                            {calculateDaysRemaining(premiumMembership.expiryDate)} days
                          </span>
                          {calculateDaysRemaining(premiumMembership.expiryDate) <= 7 && (
                            <span className="text-xs text-red-600 animate-pulse">
                              Expiring Soon!
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription History Section */}
            {history.length > 0 && (
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FaHistory className="w-5 h-5 text-gray-600" />
                    <h4 className="text-base font-semibold text-gray-800">Subscription History</h4>
                  </div>
                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                    {history.length} item{history.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {history.map((item, index) => (
                      <div key={item.transactionId} 
                           className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{item.title}</span>
                          <span className="text-sm text-gray-500">Code: {item.packageCode}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Start Date:</span>
                            <span className="ml-2 text-gray-900">{formatDate(item.startDate)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Expiry Date:</span>
                            <span className="ml-2 text-gray-900">{formatDate(item.expiryDate)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Amount Paid:</span>
                            <span className="ml-2 text-gray-900">{formatCurrency(item.finalAmountPaid)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Transaction ID:</span>
                            <span className="ml-2 text-gray-900">{item.transactionId}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t mt-auto">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmActivation}
        title="Activate Premium Subscription"
        message="Are you sure you want to activate the premium subscription for this member? This action cannot be undone."
        loading={loading}
      />

      <PackageList
        isOpen={showPackageList}
        onClose={() => setShowPackageList(false)}
        onSelect={handlePackageSelect}
        memberId={member?._id}
      />
    </div>
  );
};

export default Subscription;