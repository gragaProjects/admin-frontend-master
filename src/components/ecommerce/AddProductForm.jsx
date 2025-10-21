import { useState } from 'react'
import { FaUpload, FaTimes } from 'react-icons/fa'
import productsService from '../../services/productsService'
import api from '../../services/api'

const AddProductForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    mrp: '',
    discountInPercentage: '',
    sellingPrice: '',
    stock: '',
    images: []
  })

  const [previewImages, setPreviewImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    
    try {
      setLoading(true)
      setError(null)
      
      // Upload each image and get URLs
      const uploadedUrls = []
      let completedUploads = 0
      
      for (const file of files) {
        try {
          const formData = new FormData()
          formData.append('file', file)
          
          const response = await fetch(`${api.defaults.baseURL}/api/v1/media/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
          })
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || 'Failed to upload image')
          }
          
          const data = await response.json()
          if (data.success) {
            uploadedUrls.push(data.imageUrl)
          } else {
            throw new Error(data.message || 'Failed to upload image')
          }
          
          // Update progress
          completedUploads++
          setUploadProgress((completedUploads / files.length) * 100)
          
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError)
          throw new Error(uploadError.message || 'Failed to upload image')
        }
      }
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }))
      
      // Create preview URLs for uploaded images
      const previews = uploadedUrls.map(url => url)
      setPreviewImages(prev => [...prev, ...previews])
      
    } catch (err) {
      setError('Failed to upload images: ' + err.message)
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const calculateSellingPrice = (mrp, discountInPercentage) => {
    if (!mrp || !discountInPercentage) return mrp
    const discount = (mrp * discountInPercentage) / 100
    return Math.round(mrp - discount)
  }

  const handleMrpChange = (e) => {
    const mrp = e.target.value
    setFormData(prev => {
      const newData = { ...prev, mrp }
      if (prev.discountInPercentage) {
        newData.sellingPrice = calculateSellingPrice(mrp, prev.discountInPercentage)
      } else {
        newData.sellingPrice = mrp
      }
      return newData
    })
  }

  const handleDiscountChange = (e) => {
    const discountInPercentage = e.target.value
    setFormData(prev => ({
      ...prev,
      discountInPercentage,
      sellingPrice: calculateSellingPrice(prev.mrp, discountInPercentage)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await productsService.createProduct({
        name: formData.name,
        category: formData.category,
        mrp: Number(formData.mrp),
        discountInPercentage: Number(formData.discountInPercentage) || 0,
        sellingPrice: Number(formData.sellingPrice),
        description: formData.description,
        stock: Number(formData.stock),
        images: formData.images // This will contain the array of image URLs from the upload API
      })
      
      if (response.status === 'success') {
        onSuccess?.(response.data)
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Add New Product</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Enter product category"
              />
            </div>
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter detailed product description"
            ></textarea>
          </div>

          {/* Pricing Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MRP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MRP (₹) *
              </label>
              <input
                type="number"
                value={formData.mrp}
                onChange={handleMrpChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            {/* Discount Percentage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount (%)
              </label>
              <input
                type="number"
                value={formData.discountInPercentage}
                onChange={handleDiscountChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
                step="0.1"
                placeholder="Enter discount percentage"
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price (₹)
              </label>
              <input
                type="number"
                value={formData.sellingPrice}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
                placeholder="Calculated price after discount"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
              placeholder="Enter available stock"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                      disabled={loading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Upload Progress */}
            {loading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Uploading images...</p>
              </div>
            )}

            {/* Image Previews */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewImages.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImages(prev => prev.filter((_, i) => i !== index))
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index)
                        }))
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProductForm 