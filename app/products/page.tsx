'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Product, Category, SearchFilters } from '@/lib/types';
import ProductCard from '@/components/products/ProductCard';
import ProductSearch from '@/components/products/ProductSearch';
import MainLayout from '@/components/layout/MainLayout';
import { Filter, Grid, List, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
    inStock: false
  });

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [currentPage, filters]);

  const loadCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getProducts(currentPage, 20, filters);
      
      if (response.success && response.data) {
        setProducts(response.data.data || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setError(null);
      } else {
        setError(response.error || 'Failed to load products');
        setProducts([]);
      }
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProductsFound = (foundProducts: Product[]) => {
    setProducts(foundProducts);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
      inStock: false
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(filters).some(v => 
    v !== '' && v !== undefined && v !== false
  );

  if (loading && products.length === 0) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Search */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
              <p className="text-xl text-blue-100">Find exactly what you're looking for with our powerful search</p>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto">
              <ProductSearch 
                onProductsFound={handleProductsFound}
                onLoading={setLoading}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFiltersChange({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                  <select
                    value={filters.rating || ''}
                    onChange={(e) => handleFiltersChange({ ...filters, rating: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                {/* In Stock Filter */}
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock || false}
                      onChange={(e) => handleFiltersChange({ ...filters, inStock: e.target.checked })}
                      className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                  </label>
                </div>

                {/* Apply Filters Button */}
                <button
                  onClick={() => loadProducts()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Desktop View Controls */}
              <div className="hidden lg:flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${
                      viewMode === 'grid' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${
                      viewMode === 'list' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  {products.length} products found
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                  <p className="text-red-800">{error}</p>
                  <button
                    onClick={loadProducts}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Products Grid/List */}
              {products.length > 0 ? (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }`}>
                  {products.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Mobile Filter Content - Same as desktop but mobile optimized */}
                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFiltersChange({ ...filters, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="space-y-3">
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice || ''}
                        onChange={(e) => handleFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice || ''}
                        onChange={(e) => handleFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                    <select
                      value={filters.rating || ''}
                      onChange={(e) => handleFiltersChange({ ...filters, rating: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                    </select>
                  </div>

                  {/* In Stock Filter */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.inStock || false}
                        onChange={(e) => handleFiltersChange({ ...filters, inStock: e.target.checked })}
                        className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <button
                      onClick={() => {
                        loadProducts();
                        setShowMobileFilters(false);
                      }}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={() => {
                        clearAllFilters();
                        setShowMobileFilters(false);
                      }}
                      className="w-full bg-gray-500 text-white py-3 px-4 rounded-md hover:bg-gray-600 transition-colors font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
