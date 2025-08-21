'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { apiClient } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const response = await apiClient.addToCart(product.id, 1);
      if (response.success) {
        // You could add a toast notification here
        console.log('Product added to cart successfully');
      } else {
        console.error('Failed to add product to cart:', response.error);
        // You could add an error toast here
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      // You could add an error toast here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 text-yellow-400 fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-current" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.thumbnail || '/placeholder-product.svg'}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-product.svg';
          }}
        />
        {!product.isActive && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
          {product.category.name}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="text-lg font-bold text-gray-900 mb-3">
          {formatPrice(product.price)}
        </div>

        {/* Stock Status */}
        <div className="text-sm text-gray-600 mb-3">
          {product.stockQuantity > 0 ? (
            <span className="text-green-600">In Stock ({product.stockQuantity})</span>
          ) : (
            <span className="text-red-600">Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.isActive || product.stockQuantity === 0 || isAddingToCart}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors ${
            !product.isActive || product.stockQuantity === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isAddingToCart ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding...
            </div>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
