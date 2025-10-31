import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3x3, LayoutList, Loader, ArrowUpDown, Filter, Star, ShoppingCart, Plus, Minus, Zap } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function ViewAllProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [layout, setLayout] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    priceRange: [0, 500000],
    rating: 0,
    inStock: false
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProducts();
  }, []);

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
          images: productImages, // Set back to string format for ProductCard compatibility
          allImages: Array.isArray(product.images) ? product.images : [{ url: product.images, isPrimary: true }]
        };
      });

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      
      // Fallback demo data matching new schema
      const demoProducts = [
        { 
          _id: '1', 
          name: "MacBook Pro 16\" M3", 
          price: 249999, 
          originalPrice: 279999,
          rating: 4.9, 
          description: "Apple M3 Pro, 36GB RAM, 512GB SSD", 
          category: "Laptops", 
          brand: "Apple", 
          stock: 50, 
          images: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
          numReviews: 1234, 
          isActive: true,
          isFeatured: true,
          isOnSale: true
        },
        { 
          _id: '2', 
          name: "iPhone 15 Pro Max", 
          price: 159900, 
          originalPrice: 159900,
          rating: 4.8, 
          description: "256GB, Titanium Blue", 
          category: "Smartphones", 
          brand: "Apple", 
          stock: 100, 
          images: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
          numReviews: 2567, 
          isActive: true,
          isFeatured: true
        },
        { 
          _id: '3', 
          name: "Sony WH-1000XM5", 
          price: 29990, 
          originalPrice: 34990,
          rating: 4.7, 
          description: "Noise Cancelling, 30hr Battery", 
          category: "Audio", 
          brand: "Sony", 
          stock: 75, 
          images: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800",
          numReviews: 1845, 
          isActive: true,
          isOnSale: true
        },
        { 
          _id: '4', 
          name: "Apple Watch Ultra 2", 
          price: 89900, 
          originalPrice: 89900,
          rating: 4.8, 
          description: "GPS + Cellular, Titanium", 
          category: "Wearables", 
          brand: "Apple", 
          stock: 30, 
          images: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800",
          numReviews: 989, 
          isActive: true,
          isFeatured: true
        },
        { 
          _id: '5', 
          name: "Sony A7 IV Camera", 
          price: 249999, 
          originalPrice: 249999,
          rating: 4.9, 
          description: "33MP Full-Frame, 4K 60fps", 
          category: "Cameras", 
          brand: "Sony", 
          stock: 20, 
          images: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800",
          numReviews: 678, 
          isActive: true
        },
        { 
          _id: '6', 
          name: "iPad Pro 12.9\" M2", 
          price: 109999, 
          originalPrice: 109999,
          rating: 4.8, 
          description: "256GB, Wi-Fi + Cellular", 
          category: "Tablets", 
          brand: "Apple", 
          stock: 60, 
          images: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
          numReviews: 1521, 
          isActive: true
        },
        { 
          _id: '7', 
          name: "Samsung 4K Monitor 32\"", 
          price: 54999, 
          originalPrice: 54999,
          rating: 4.6, 
          description: "UHD, 144Hz, HDR10", 
          category: "Monitors", 
          brand: "Samsung", 
          stock: 40, 
          images: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
          numReviews: 892, 
          isActive: true
        },
        { 
          _id: '8', 
          name: "PlayStation 5 Pro", 
          price: 69999, 
          originalPrice: 69999,
          rating: 4.9, 
          description: "2TB SSD, 8K Support", 
          category: "Gaming", 
          brand: "Sony", 
          stock: 25, 
          images: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
          numReviews: 3456, 
          isActive: true
        },
        { 
          _id: '9', 
          name: "Dell XPS 15", 
          price: 189999, 
          originalPrice: 209999,
          rating: 4.7, 
          description: "Intel i9, 32GB RAM, RTX 4060", 
          category: "Laptops", 
          brand: "Dell", 
          stock: 35, 
          images: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
          numReviews: 987, 
          isActive: true,
          isOnSale: true
        },
        { 
          _id: '10', 
          name: "Samsung Galaxy S24 Ultra", 
          price: 129999, 
          originalPrice: 134999,
          rating: 4.8, 
          description: "512GB, Titanium Gray", 
          category: "Smartphones", 
          brand: "Samsung", 
          stock: 80, 
          images: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800",
          numReviews: 2134, 
          isActive: true,
          isOnSale: true
        },
        { 
          _id: '11', 
          name: "Bose QuietComfort Ultra", 
          price: 42999, 
          originalPrice: 42999,
          rating: 4.7, 
          description: "Premium ANC, 24hr Battery", 
          category: "Audio", 
          brand: "Bose", 
          stock: 55, 
          images: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
          numReviews: 1456, 
          isActive: true
        },
        { 
          _id: '12', 
          name: "Canon EOS R5", 
          price: 389999, 
          originalPrice: 389999,
          rating: 4.9, 
          description: "45MP, 8K Video, IBIS", 
          category: "Cameras", 
          brand: "Canon", 
          stock: 15, 
          images: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
          numReviews: 543, 
          isActive: true
        },
      ];
      setProducts(demoProducts);
      setFilteredProducts(demoProducts);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">All Products</h1>
              <p className="text-sm text-gray-600">{filteredProducts.length} products available</p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name: A-Z</option>
                <option value="newest">Newest First</option>
              </select>

              <div className="hidden sm:flex gap-1 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setLayout('grid')}
                  className={`p-2 rounded-lg transition ${layout === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`p-2 rounded-lg transition ${layout === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  title="List View"
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'fixed inset-0 bg-black bg-opacity-50 z-50 lg:relative lg:bg-transparent' : 'hidden'} lg:block lg:w-64 lg:flex-shrink-0`}>
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
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{cat}</span>
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

              {/* In Stock Filter */}
              <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={() => setFilters(prev => ({ ...prev, inStock: !prev.inStock }))}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    In Stock Only
                  </span>
                </label>
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
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={layout === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} layout={layout} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}