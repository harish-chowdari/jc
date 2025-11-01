import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Heart, User, ChevronRight, Zap, Shield, Truck, Laptop, Smartphone, Headphones, Watch, Camera, Gamepad, Loader, TrendingUp, Package, CreditCard, Clock, Star, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import getUserId from '../utils/getUserId';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function EcommerceHomepage() {

  const userId = getUserId();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // API Base URL - Update this to your backend URL
  const API_BASE_URL = 'http://localhost:5000/api';

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
    { name: "Laptops", image: "https://tse3.mm.bing.net/th/id/OIP.E7s9xyTEf7KV97V81H2w7wHaFU?pid=Api&P=0&h=180", color: "bg-blue-500" },
    { name: "Smartphones", image: "https://tse3.mm.bing.net/th/id/OIP.e943jRQHTUQBM4LXS9w6mgHaHa?pid=Api&P=0&h=180", color: "bg-purple-500" },
    { name: "Audio", image: "https://tse2.mm.bing.net/th/id/OIP.tgx3GUGc4l85QJ7kNLp4VQHaJk?pid=Api&P=0&h=180", color: "bg-pink-500" },
    { name: "Wearables", image: "https://tse4.mm.bing.net/th/id/OIP.MDePs4w8n5gkgkZwu7ghowHaHa?pid=Api&P=0&h=180", color: "bg-green-500" },
    { name: "Cameras", image: "https://tse4.mm.bing.net/th/id/OIP.ps4xWduyiWAwW3pnPcO-_wHaE8?pid=Api&P=0&h=180", color: "bg-orange-500" },
    { name: "Gaming", image: "https://tse3.mm.bing.net/th/id/OIP.USfxkHuVDu_cAVQGn-3gDwHaHa?pid=Api&P=0&h=180", color: "bg-red-500" },
  ];

  const features = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "On orders over AED 250"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Payment",
      description: "100% protected"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Always here to help"
    }
  ];

  const deals = [
    {
      title: "Mega Sale",
      discount: "50% OFF",
      category: "Laptops",
      bg: "bg-gradient-to-br from-blue-500 to-blue-700",
      image: "https://tse1.mm.bing.net/th/id/OIP.ejs8uD5aFnJaiDLwOO-khQHaE7?pid=Api&P=0&h=180"
    },
    {
      title: "Hot Deals",
      discount: "30% OFF",
      category: "Smartphones",
      bg: "bg-gradient-to-br from-purple-500 to-purple-700",
      image: "https://tse4.mm.bing.net/th/id/OIP.EKV8i_Zwq5I2WOggwmXT1AHaEK?pid=Api&P=0&h=180"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing products and fast delivery! Highly recommended.",
      product: "MacBook Pro"
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "Best prices and excellent customer service.",
      product: "iPhone 15 Pro"
    },
    {
      name: "Emma Davis",
      rating: 5,
      comment: "Great quality and authentic products!",
      product: "Sony Headphones"
    }
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

  // Handle category click
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    navigate('/products', { state: { category: categoryName } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 text-center text-sm font-medium">
        <Zap className="inline w-4 h-4 mr-2" />
        Flash Sale: Extra 15% Off on Gaming Laptops | Use Code: GAME15
      </div>

      {/* Header */}
      <Header />

      {/* Features Section */}
      <section className="py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center gap-4 border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  {feature.icon}
                </div>
                <div className='flex flex-col items-center'>
                  <h3 className="font-bold text-sm text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-center text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal Banners */}
      <section className="py-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {deals.map((deal, index) => (
              <div 
                key={index}
                onClick={() => handleCategoryClick(deal.category)}
                className="relative rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition shadow-xl h-64"
              >
                {/* Background Image with Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${deal.image})` }}
                >
                  <div className={`absolute inset-0 ${deal.bg} opacity-80`}></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-8 text-white h-full flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">{deal.title}</span>
                  </div>
                  <h3 className="text-5xl font-bold mb-2">{deal.discount}</h3>
                  <p className="text-xl mb-6">On All {deal.category}</p>
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-flex items-center gap-2 w-fit">
                    Shop Now
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Explore our wide range of products</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.name)}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-2 cursor-pointer p-4 text-center border border-gray-100"
              >
                <div className="w-20 h-20 overflow-hidden mx-auto mb-4">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-bold text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl text-nowrap font-bold text-gray-900 mb-2 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                Trending Products
              </h2>
              <p className="text-gray-600">Best sellers this month</p>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="text-blue-600 text-nowrap hover:text-blue-700 font-bold flex items-center gap-2 px-2 py-2 bg-white rounded shadow-sm hover:shadow-md transition"
            >
              View All 
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-10 bg-white rounded-2xl shadow-sm">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
              <span className="ml-3 text-gray-600 text-lg">Loading products...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="text-yellow-800 mb-2 text-lg font-semibold">Could not connect to the server</p>
              <p className="text-sm text-yellow-600 mb-4">Showing demo products. Please check your API connection.</p>
              <button 
                onClick={fetchProducts}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
              >
                Retry Connection
              </button>
            </div>
          )}

          {/* Products Grid */}
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
            <div className="text-center py-10 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg">No products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-7 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">Purchased {testimonial.product}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};