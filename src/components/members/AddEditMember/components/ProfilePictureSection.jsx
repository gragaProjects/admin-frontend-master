import React, { useState } from 'react';
import { FaSpinner, FaUpload, FaTrash } from 'react-icons/fa';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { uploadMedia } from '../../../../services/mediaService';

const ProfilePictureSection = ({ formData, setFormData, isUploadingImage, setIsUploadingImage, setError }) => {
  const { showSnackbar } = useSnackbar();
  const [previewUrl, setPreviewUrl] = useState(formData.profilePic || '');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showSnackbar('Please upload an image file', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showSnackbar('Image size should be less than 5MB', 'error');
      return;
    }

    try {
      setIsUploadingImage(true);
      const response = await uploadMedia(file);
      
      if (response.success && response.imageUrl) {
        setFormData(prev => ({
          ...prev,
          profilePic: response.imageUrl
        }));
        setPreviewUrl(response.imageUrl);
        showSnackbar('Image uploaded successfully', 'success');
      } else {
        throw new Error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      showSnackbar('Failed to upload image', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      profilePic: ''
    }));
    setPreviewUrl('');
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h4>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-grow">
          <label className="relative inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isUploadingImage}
            />
            <div className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer flex items-center space-x-2 ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploadingImage ? (
                <>
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <FaUpload className="w-4 h-4" />
                  <span>{previewUrl ? 'Change Image' : 'Upload Image'}</span>
                </>
              )}
            </div>
          </label>
          <p className="mt-2 text-sm text-gray-500">
            Supported formats: JPG, PNG. Max size: 5MB
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureSection; 