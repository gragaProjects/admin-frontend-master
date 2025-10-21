import React, { useState, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { packageService } from '../../../services/packageService';

const AddPackageForm = ({ initialData, onSubmit, onClose, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    durationInDays: initialData?.durationInDays || 30,
    price: initialData?.price || '',
    active: initialData?.active ?? true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const submitLock = useRef(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || submitLock.current) {
      return;
    }

    setIsSubmitting(true);
    submitLock.current = true;
    setError(null);

    try {
      if (!formData.title || !formData.description || !formData.price) {
        throw new Error('Title, description, and price are required fields');
      }

      const cleanData = {
        title: formData.title,
        description: formData.description,
        durationInDays: parseInt(formData.durationInDays),
        durationInMonths: Math.floor(parseInt(formData.durationInDays) / 30),
        price: parseFloat(formData.price),
        active: formData.active
      };

      let response;
      if (isEditMode && initialData?._id) {
        response = await packageService.updatePackage(initialData._id, cleanData);
      } else {
        response = await packageService.createPackage(cleanData);
      }
      
      if (response?.status === 'success') {
        if (onSubmit) {
          await onSubmit(response.data);
        }
        if (onClose) {
          onClose();
        }
      } else {
        throw new Error(response?.message || `Failed to ${isEditMode ? 'update' : 'create'} package`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} package:`, error);
      setError(error.message || `Failed to ${isEditMode ? 'update' : 'add'} package`);
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  const handleClose = () => {
    if (onCancel && isEditMode) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const calculateDuration = (days) => {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    
    if (months === 0) {
      return `${remainingDays} days`;
    } else if (remainingDays === 0) {
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      return `${months} ${months === 1 ? 'month' : 'months'} ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-base font-medium text-gray-900 mb-4">Package Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              placeholder="Enter a detailed description of the package..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[150px]"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Provide a clear and detailed description of what the package includes
            </p>
          </div>
        </div>
      </div>

      {/* Duration and Price */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-base font-medium text-gray-900 mb-4">Duration and Price</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Days) *
            </label>
            <input
              type="number"
              name="durationInDays"
              value={formData.durationInDays}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              {calculateDuration(formData.durationInDays)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-base font-medium text-gray-900 mb-4">Status</h4>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="active"
            id="active"
            checked={formData.active}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
            Package is active
          </label>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Package' : 'Add Package'}
        </button>
      </div>
    </form>
  );
};

export default AddPackageForm; 