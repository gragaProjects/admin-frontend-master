import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import AddProductForm from './AddProductForm'
import ProductDetailsModal from './ProductDetailsModal'
import ProductGrid from './ProductGrid'
import productsService from '../../services/productsService'

const EcommercePage = () => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [searchQuery])

  const fetchProducts = async (isLoadMore = false) => {
    try {
      setLoading(!isLoadMore)
      setError(null)
      
      const response = await productsService.getAllProducts(
        isLoadMore ? page + 1 : 1,
        10,
        searchQuery
      )

      if (response.status === 'success') {
        const { data, pagination } = response
        setProducts(prev => isLoadMore ? [...prev, ...data] : data)
        setHasMore(pagination.page < pagination.pages)
        if (isLoadMore) {
          setPage(prev => prev + 1)
        } else {
          setPage(1)
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(true)
    }
  }

  const handleEdit = (product) => {
    setShowAddForm(true)
    setSelectedProduct(null)
  }

  const handleDelete = async (productId) => {
    try {
      await productsService.deleteProduct(productId)
      setProducts(products.filter(product => product._id !== productId))
    } catch (err) {
      setError(err.message || 'Failed to delete product')
    }
  }

  return (
    <div className="p-4">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <ProductGrid 
        products={products}
        onProductClick={setSelectedProduct}
        loading={loading}
        error={error}
      />

      {/* Load More Button */}
      {hasMore && !loading && !error && products.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {/* Modals */}
      {showAddForm && (
        <AddProductForm onClose={() => setShowAddForm(false)} />
      )}

      {selectedProduct && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default EcommercePage 