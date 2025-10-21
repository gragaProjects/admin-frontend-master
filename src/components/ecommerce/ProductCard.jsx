const ProductCard = ({ product, onClick }) => {
  const fallbackImageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMHB4IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJvZHVjdCBJbWFnZTwvdGV4dD4KPC9zdmc+'

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="h-40 bg-gray-200 flex items-center justify-center relative">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackImageUrl
            }}
          />
        ) : (
          <img 
            src={fallbackImageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        )}
        {product.offerPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
            {product.offerPercentage}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
          {product.description ? (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          ) : (
            <p className="text-sm text-gray-400 italic mb-2 min-h-[2.5rem]">No description available</p>
          )}
          
          {/* Category */}
          {product.category && (
            <div className="mb-2">
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {product.category}
              </span>
            </div>
          )}
        </div>
        
        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-center gap-1 flex-wrap mb-1">
            <span className="text-lg font-bold text-blue-600">
              ₹{product.offerPrice.toLocaleString('en-IN')}
            </span>
            {product.offerPercentage > 0 && (
              <span className="text-gray-500 line-through text-xs">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mb-3">
            Stock: {product.stock} units
          </div>

          <button 
            onClick={() => onClick(product)}
            className="w-full px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard 