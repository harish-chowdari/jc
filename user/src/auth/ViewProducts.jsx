import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3x3, LayoutList, Loader, ArrowUpDown, Filter, Star, ShoppingCart, Plus, Minus, Zap } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';

export default function ViewAllProducts() {
  const location = useLocation();
  const categoryFromNav = location.state?.category;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  const [filters, setFilters] = useState({
    category: categoryFromNav ? [categoryFromNav] : [],
    brand: [],
    priceRange: [0, 500000],
    rating: 0,
    inStock: false
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A to Z' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update filters when category from navigation changes
  useEffect(() => {
    if (categoryFromNav && !filters.category.includes(categoryFromNav)) {
      setFilters(prev => ({
        ...prev,
        category: [categoryFromNav]
      }));
    }
  }, [categoryFromNav]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      const activeProducts = data.filter(product => product.isActive);
      
      // Transform products to ensure compatibility with both old and new schema
      const transformedProducts = activeProducts.map(product => {
        // Handle images - support both old (string) and new (array) formats
        let productImages = product.images;
        
        if (Array.isArray(product.images) && product.images.length > 0) {
          // New schema with array of image objects
          const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
          productImages = primaryImage.url;
        } else if (typeof product.images === 'string') {
          // Old schema with single image string
          productImages = product.images;
        } else {
          // Fallback placeholder
          productImages = 'https://via.placeholder.com/400x300?text=No+Image';
        }

        return {
          ...product,
          images: Array.isArray(product.images) && product.images.length > 0 
            ? product.images 
            : [{ url: productImages, isPrimary: true, alt: product.name }],
          allImages: Array.isArray(product.images) ? product.images : [{ url: product.images, isPrimary: true }]
        };
      });

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, sortBy, products]);

  const applyFilters = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }

    if (filters.category.length > 0) {
      filtered = filtered.filter(p => filters.category.includes(p.category));
    }

    if (filters.brand.length > 0) {
      filtered = filtered.filter(p => filters.brand.includes(p.brand));
    }

    filtered = filtered.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    if (filters.rating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.rating);
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.stock > 0);
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        // Featured - prioritize featured and on-sale items
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          if (a.isOnSale && !b.isOnSale) return -1;
          if (!a.isOnSale && b.isOnSale) return 1;
          return 0;
        });
        break;
    }

    setFilteredProducts(filtered);
  };

  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(v => v !== value)
        : [...prev[type], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      priceRange: [0, 500000],
      rating: 0,
      inStock: false
    });
    setSearchQuery('');
    // Clear the navigation state as well
    window.history.replaceState({}, document.title);
  };

  const activeFiltersCount = 
    filters.category.length + 
    filters.brand.length + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.inStock ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Toolbar */}
        <div className="mb-6">
          {/* Mobile: Stacked Layout */}
          <div className="lg:hidden space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
              >
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm"
                  >
                    <ArrowUpDown className="w-5 h-5" />
                    <span className="font-medium hidden sm:inline">
                      {sortOptions.find(opt => opt.value === sortBy)?.label}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showSortDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowSortDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        {sortOptions.map(option => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSortBy(option.value);
                              setShowSortDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition ${
                              sortBy === option.value 
                                ? 'text-blue-600 font-semibold bg-blue-50' 
                                : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Layout Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                  <button
                    onClick={() => setLayout('grid')}
                    className={`p-2 rounded transition ${
                      layout === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setLayout('list')}
                    className={`p-2 rounded transition ${
                      layout === 'list' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop: Single Line Layout */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Active Filters Badge */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium whitespace-nowrap">
                <Filter className="w-4 h-4" />
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
              </div>
            )}

            {/* Search Bar - Takes remaining space */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-3.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm whitespace-nowrap"
              >
                <ArrowUpDown className="w-5 h-5" />
                <span className="font-medium">
                  {sortOptions.find(opt => opt.value === sortBy)?.label}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSortDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    {sortOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition ${
                          sortBy === option.value 
                            ? 'text-blue-600 font-semibold bg-blue-50' 
                            : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2.5 rounded-lg transition ${
                  layout === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2.5 rounded-lg transition ${
                  layout === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div style={{
              backgroundColor: showFilters ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
            }} className={`${showFilters ? 'fixed inset-0 bg-opacity-50 z-50 lg:relative lg:bg-transparent' : 'hidden'} lg:block lg:w-64 lg:flex-shrink-0`}>
            <div className={`${showFilters ? 'fixed right-0 top-0 h-full w-80 transform transition-transform' : ''} lg:relative lg:w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-24 overflow-y-auto max-h-[calc(100vh-120px)]`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filters
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(cat)}
                        onChange={() => toggleFilter('category', cat)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`ml-3 text-sm group-hover:text-gray-900 ${
                        filters.category.includes(cat) ? 'font-semibold text-blue-600' : 'text-gray-700'
                      }`}>
                        {cat}
                        {categoryFromNav === cat && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Brand</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={() => toggleFilter('brand', brand)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => setFilters(prev => ({ ...prev, rating }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3 flex items-center">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="ml-2 text-sm text-gray-700">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 text-lg">Loading amazing products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  {categoryFromNav 
                    ? `No products available in "${categoryFromNav}" category` 
                    : 'Try adjusting your filters or search query'
                  }
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div>
                {/* Results count */}
                <div className="mb-4 text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
                  {categoryFromNav && (
                    <span> in <span className="font-semibold text-blue-600">{categoryFromNav}</span></span>
                  )}
                </div>
                
                <div className={layout === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-4'
                }>
                  {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} layout={layout} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}