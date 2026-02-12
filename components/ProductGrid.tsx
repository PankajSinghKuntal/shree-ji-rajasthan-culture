import React from 'react';
import { Product, Category } from '../types';

interface ProductGridProps {
  products: Product[];
  category: Category | null;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = (props: ProductGridProps) => {
  const { products, category, onAddToCart, onBack } = props;

  return (
    <div className="py-8 sm:py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-950 tracking-wider leading-tight">
              {category ? category : 'ALL PRODUCTS'}
            </h2>
            <p className="text-sm sm:text-base text-amber-700 mt-2">{products.length} items available</p>
          </div>
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-amber-100 text-amber-900 font-bold rounded-lg hover:bg-amber-200 transition-colors text-sm sm:text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
            aria-label="Back to categories"
          >
            ← Back
          </button>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 hover:border-amber-400 flex flex-col h-full focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-700"
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" aria-hidden="true"></div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex flex-col flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-amber-950 mb-2 line-clamp-2 h-auto sm:h-14 leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-700 mb-4 line-clamp-2 h-auto sm:h-10 leading-relaxed flex-1">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-amber-900">₹{product.price}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => onAddToCart(product)}
                    className="w-full py-2 sm:py-3 bg-gradient-to-r from-amber-700 to-amber-900 text-white font-bold rounded-lg hover:shadow-lg hover:from-amber-800 hover:to-amber-950 transition-all duration-300 uppercase text-xs sm:text-sm tracking-widest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 mt-auto"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    + Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl sm:text-2xl text-amber-700 font-semibold">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
