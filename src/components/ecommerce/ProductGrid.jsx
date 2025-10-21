import ProductCard from './ProductCard'

const ProductGrid = ({ products, onProductClick, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Error loading products</div>
        <div className="text-gray-500">{error}</div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No products found matching your search.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product._id}
          product={{
            ...product,
            id: product._id,
            price: product.mrp,
            offerPrice: product.sellingPrice,
            offerPercentage: product.discountInPercentage
          }}
          onClick={onProductClick}
        />
      ))}
    </div>
  )
}

export default ProductGrid 