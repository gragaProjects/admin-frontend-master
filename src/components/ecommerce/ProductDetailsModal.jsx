import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import productsService from '../../services/productsService'

const ProductDetailsModal = ({ product: initialProduct, onClose, onEdit, onDelete }) => {
  const [product, setProduct] = useState(initialProduct)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProductDetails()
  }, [initialProduct._id])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await productsService.getProductById(initialProduct._id)
      
      if (response.status === 'success') {
        // Transform API response to match UI requirements
        setProduct({
          ...response.data,
          id: response.data._id,
          price: response.data.mrp,
          offerPrice: response.data.sellingPrice,
          offerPercentage: response.data.discountInPercentage || 0,
          images: response.data.images || []
        })
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch product details')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await productsService.deleteProduct(product._id)
      onDelete?.(product._id)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to delete product')
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg 
                className="mx-auto h-12 w-12"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Error</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={fetchProductDetails}
                className="px-4 py-2 text-blue-500 hover:text-blue-600"
              >
                Try again
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-500 hover:text-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Product Details</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(product)}
              className="p-2 hover:bg-blue-100 rounded-full text-blue-600 transition-colors"
              title="Edit product"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
              title="Delete product"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
              title="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Product Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <div key={index} className="relative aspect-video">
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=Product+Image'
                    }}
                  />
                </div>
              ))
            ) : (
              <div className="relative aspect-video">
                <img
                  src="https://via.placeholder.com/400x200?text=No+Image+Available"
                  alt="No Image Available"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Basic Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-500">Product Name</label>
                  <p className="text-lg font-medium">{product.name}</p>
                </div>
                {product.description && (
                  <div>
                    <label className="block text-sm text-gray-500">Description</label>
                    <p className="text-gray-700">{product.description}</p>
                  </div>
                )}
                {product.category && (
                  <div>
                    <label className="block text-sm text-gray-500">Category</label>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                      {product.category}
                    </span>
                  </div>
                )}
                <div>
                  <label className="block text-sm text-gray-500">Created At</label>
                  <p className="text-gray-700">
                    {new Date(product.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Pricing Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-500">Regular Price (MRP)</label>
                  <p className="text-lg font-medium">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
                {product.offerPercentage > 0 && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-500">Discount</label>
                      <p className="text-lg font-medium text-green-600">{product.offerPercentage}% OFF</p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500">Selling Price</label>
                      <p className="text-xl font-bold text-blue-600">₹{product.offerPrice.toLocaleString('en-IN')}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Inventory</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm text-gray-500">Available Stock</label>
                  <p className="text-lg font-medium">{product.stock} units</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 20 ? 'bg-green-100 text-green-800' : 
                  product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 20 ? 'In Stock' : 
                   product.stock > 5 ? 'Low Stock' : 
                   'Critical Stock'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Delete Product</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetailsModal 