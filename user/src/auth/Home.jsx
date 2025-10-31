import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, User, ChevronRight, Zap, Shield, Truck, Laptop, Smartphone, Headphones, Watch, Camera, Gamepad, Loader, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard'; // Import the ProductCard component

export default function EcommerceHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL - Update this to your backend URL
  const API_BASE_URL = 'http://localhost:5000/api'; // Change to your actual API URL

  const heroSlides = [
    {
      title: "Latest Tech Gadgets 2024",
      subtitle: "Up to 40% Off on Premium Electronics",
      bg: "from-blue-600 to-cyan-600"
    },
    {
      title: "Gaming Essentials",
      subtitle: "Level Up Your Gaming Experience",
      bg: "from-purple-600 to-pink-600"
    },
    {
      title: "Smart Home Devices",
      subtitle: "Connect Your Home to the Future",
      bg: "from-green-600 to-emerald-600"
    }
  ];

  const categories = [
    { name: "Laptops", icon: <Laptop className="w-8 h-8" />, color: "bg-blue-500" },
    { name: "Smartphones", icon: <Smartphone className="w-8 h-8" />, color: "bg-purple-500" },
    { name: "Audio", icon: <Headphones className="w-8 h-8" />, color: "bg-pink-500" },
    { name: "Wearables", icon: <Watch className="w-8 h-8" />, color: "bg-green-500" },
    { name: "Cameras", icon: <Camera className="w-8 h-8" />, color: "bg-orange-500" },
    { name: "Gaming", icon: <Gamepad className="w-8 h-8" />, color: "bg-red-500" },
  ];

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      const activeProducts = data.filter(product => product.isActive);
      setProducts(activeProducts);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      
      // Fallback mock data if API fails
      setProducts([
        { 
          _id: '1',
          name: "MacBook Pro 16\" M3", 
          price: 2499.99, 
          rating: 4.9, 
          description: "Apple M3 Pro, 36GB RAM, 512GB SSD",
          category: "Laptops",
          brand: "Apple",
          stock: 50,
          images: "💻", 
          numReviews: 1234,
          isActive: true
        },
        { 
          _id: '2',
          name: "iPhone 15 Pro Max", 
          price: 1199.99, 
          rating: 4.8, 
          description: "256GB, Titanium Blue",
          category: "Smartphones",
          brand: "Apple",
          stock: 100,
          images: "📱", 
          numReviews: 2567,
          isActive: true
        },
        { 
          _id: '3',
          name: "Sony WH-1000XM5", 
          price: 399.99, 
          rating: 4.7, 
          description: "Noise Cancelling, 30hr Battery",
          category: "Audio",
          brand: "Sony",
          stock: 75,
          images: "🎧", 
          numReviews: 1845,
          isActive: true
        },
        { 
          _id: '4',
          name: "Apple Watch Ultra 2", 
          price: 799.99, 
          rating: 4.8, 
          description: "GPS + Cellular, Titanium",
          category: "Wearables",
          brand: "Apple",
          stock: 30,
          images: "⌚", 
          numReviews: 989,
          isActive: true
        },
        { 
          _id: '5',
          name: "Sony A7 IV Camera", 
          price: 2499.99, 
          rating: 4.9, 
          description: "33MP Full-Frame, 4K 60fps",
          category: "Cameras",
          brand: "Sony",
          stock: 20,
          images: "📷", 
          numReviews: 678,
          isActive: true
        },
        { 
          _id: '6',
          name: "iPad Pro 12.9\" M2", 
          price: 1099.99, 
          rating: 4.8, 
          description: "256GB, Wi-Fi + Cellular",
          category: "Tablets",
          brand: "Apple",
          stock: 60,
          images: "📱", 
          numReviews: 1521,
          isActive: true
        },
        { 
          _id: '7',
          name: "Samsung 4K Monitor 32\"", 
          price: 549.99, 
          rating: 4.6, 
          description: "UHD, 144Hz, HDR10",
          category: "Monitors",
          brand: "Samsung",
          stock: 40,
          images: "🖥️", 
          numReviews: 892,
          isActive: true
        },
        { 
          _id: '8',
          name: "PlayStation 5 Pro", 
          price: 699.99, 
          rating: 4.9, 
          description: "2TB SSD, 8K Support",
          category: "Gaming",
          brand: "Sony",
          stock: 25,
          images: "🎮", 
          numReviews: 3456,
          isActive: true
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Hero carousel auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle add to cart
  const handleAddToCart = (product) => {
    setCartCount(cartCount + 1);
    console.log('Added to cart:', product);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center text-sm font-medium">
        <Zap className="inline w-4 h-4 mr-2" />
        Flash Sale: Extra 15% Off on Gaming Laptops | Use Code: GAME15
      </div>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button 
                className="lg:hidden mr-3 text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center space-x-2">
                <Zap className="w-7 h-7 text-blue-600" />
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TechVault
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for laptops, phones, headphones..."
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button className="hidden sm:flex items-center text-gray-700 hover:text-blue-600 transition">
                <User className="w-6 h-6" />
              </button>
              <button className="hidden sm:flex items-center text-gray-700 hover:text-blue-600 transition">
                <Heart className="w-6 h-6" />
              </button>
              <button className="relative text-gray-700 hover:text-blue-600 transition">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search electronics..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#" className="block text-gray-700 hover:text-blue-600">Categories</a>
              <a href="#" className="block text-gray-700 hover:text-blue-600">Deals</a>
              <a href="#" className="block text-gray-700 hover:text-blue-600">New Arrivals</a>
              <a href="#" className="block text-gray-700 hover:text-blue-600">Best Sellers</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Carousel */}
      <section className="relative h-96 bg-gradient-to-r overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="text-white max-w-2xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                  {slide.title}
                </h1>
                <p className="text-xl sm:text-2xl mb-8 opacity-90">
                  {slide.subtitle}
                </p>
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105">
                  Shop Now <ChevronRight className="inline w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Warranty Included</h3>
                <p className="text-sm text-gray-600">2-year protection</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Latest Tech</h3>
                <p className="text-sm text-gray-600">New arrivals weekly</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Expert Support</h3>
                <p className="text-sm text-gray-600">24/7 tech assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer p-6 text-center"
              >
                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Trending Electronics</h2>
            <a href="/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              View All <ChevronRight className="w-5 h-5" />
            </a>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600 text-lg">Loading products...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-800 mb-2">⚠️ Could not connect to the server</p>
              <p className="text-sm text-yellow-600">Showing demo products. Please check your API connection.</p>
              <button 
                onClick={fetchProducts}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Products Grid - Using ProductCard Component */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard 
                  key={product._id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {/* No Products */}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  TechVault
                </h3>
              </div>
              <p className="text-gray-400 text-sm">
                Your trusted destination for premium electronics and cutting-edge technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
                <li><a href="#" className="hover:text-white transition">Warranty Info</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-3">Get the latest tech deals</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-l-lg text-gray-900 focus:outline-none"
                />
                <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 TechVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}