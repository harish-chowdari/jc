import React, { useState, useEffect } from 'react'
import {
  ShoppingCart,
  Heart,
  Star,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
  Award,
  Zap,
  TrendingUp
} from 'lucide-react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import getUserId from '../utils/getUserId' // optional helper; fallback to localStorage below
import Header from '../components/Header'

export default function ProductDetailsPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [inCart, setInCart] = useState(false)
  const [wishlist, setWishlist] = useState(false)
  const API = 'http://localhost:5000/api' // change if needed
  const [activeTab, setActiveTab] = useState('description')

  const userId = getUserId?.() || localStorage.getItem('userId') || null

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`${API}/products/${productId}`)
        // API may return the product directly or wrapped; handle both
        const fetched = res?.data?.product ?? res?.data ?? null
        if (fetched) {
          setProduct(fetched)
          // select primary image index if available
          const images = Array.isArray(fetched?.images) ? fetched.images : []
          const primaryIndex = images.findIndex((img) => img?.isPrimary)
          setSelectedImage(primaryIndex >= 0 ? primaryIndex : 0)
          // set quantity to 1 or 0 if out of stock
          setQuantity(fetched?.stock > 0 ? 1 : 0)
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error('Error fetching product:', err?.response?.data ?? err?.message)
        setError('Failed to load product. Try again.')
      } finally {
        setLoading(false)
      }
    }

    const fetchCart = async () => {
      if (!userId) return
      try {
        const res = await axios.get(`${API}/cart/${userId}`)
        const cartItems = res?.data?.items || []
        const found = cartItems.find((item) => item?.productId?._id === productId || item?.productId === productId)
        if (found) {
          setInCart(true)
          setQuantity(found?.quantity || 1)
        }
      } catch (err) {
        console.error('Error fetching cart:', err?.response?.data ?? err?.message)
      }
    }

    if (productId) {
      fetchProduct()
      fetchCart()
    }
  }, [productId, userId])

  const imagesArray = Array.isArray(product?.images)
    ? product.images.map((img) => img?.url ?? img) // handle both {url,..} or string entries
    : typeof product?.images === 'string'
    ? [product.images]
    : []

  const displayPrice = product?.price ?? 0
  const displayOriginal = product?.originalPrice ?? 0
  const discountPct =
    displayOriginal && displayOriginal > displayPrice
      ? Math.round(((displayOriginal - displayPrice) / displayOriginal) * 100)
      : 0

  const handleAddToCart = async () => {
    if (!userId) {
      alert('No userId found. Save userId in localStorage or implement getUserId() utility.')
      return
    }
    if (!product?._id) {
      alert('Product not loaded yet.')
      return
    }
    try {
      const body = { userId, productId: product._id, quantity: quantity || 1 }
      const res = await axios.post(`${API}/cart`, body)
      setInCart(true)
      alert(res?.data?.message || `Added ${body.quantity} item(s) to cart`)
    } catch (err) {
      console.error('Add to cart error:', err?.response?.data ?? err?.message)
      alert('Failed to add to cart')
    }
  }

  const handleUpdateCart = async (action) => {
    if (!userId) {
      alert('No userId found.')
      return
    }
    if (!product?._id) {
      alert('Product not loaded yet.')
      return
    }
    try {
      const newQuantity = action === 'increase' ? quantity + 1 : quantity - 1
      
      if (newQuantity <= 0) {
        // Remove from cart if quantity is 0
        setInCart(false)
        setQuantity(1)
        return
      }

      const res = await axios.put(`${API}/cart/update`, {
        userId,
        productId: product._id,
        quantity: newQuantity
      })
      
      setQuantity(newQuantity)
      alert(res?.data?.message || 'Cart updated successfully!')
    } catch (err) {
      console.error('Cart update error:', err?.response?.data ?? err?.message)
      alert('Failed to update cart')
    }
  }

  const handleIncrease = () => {
    if (quantity < (product?.stock ?? 0)) setQuantity((q) => q + 1)
  }
  const handleDecrease = () => {
    if (quantity > 1) setQuantity((q) => q - 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 mx-auto animate-spin text-blue-600" />
          <p className="mt-3 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error ?? 'Product not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <Header />
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <a href="/home" className="hover:text-blue-600">
              Home
            </a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <a href="/products" className="hover:text-blue-600">
              {product?.category ?? 'Products'}
            </a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900">{ product?.name?.length < 20 ? product?.name : product?.name?.slice(0, 20) + '...'}</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={imagesArray?.[selectedImage] ?? '/placeholder.png'}
                alt={product?.name ?? 'Product image'}
                className="w-full h-96 object-contain"
              />
            </div>

            {imagesArray?.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {imagesArray.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden ${selectedImage === idx ? 'border-blue-600' : 'border-gray-200'}`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-20 object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-blue-600">{product?.brand}</span>
                <button onClick={() => setWishlist((w) => !w)} className="text-gray-400 hover:text-red-500 transition">
                  <Heart className={`w-6 h-6 ${wishlist ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-4">
                <span className="text-4xl font-bold text-gray-900">AED {(displayPrice ?? 0).toFixed(2)}</span>
                {displayOriginal > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">AED {displayOriginal.toFixed(2)}</span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Save {discountPct}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock status */}
              <div className="mb-6">
                {product?.stock > (product?.lowStockThreshold ?? 10) ? (
                  <div className="flex items-center text-green-600">
                    <Check className="w-5 h-5 mr-2" />
                    <span className="font-semibold">In Stock ({product?.stock} available)</span>
                  </div>
                ) : product?.stock > 0 ? (
                  <div className="flex items-center text-orange-600">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Only {product?.stock} left - Order soon!</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product?.description}</p>

              {/* Key features */}
              {Array.isArray(product?.features) && product.features.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.slice(0, 6).map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <Check className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity + Actions */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    onClick={() => inCart ? handleUpdateCart('decrease') : handleDecrease()} 
                    className="px-4 py-2 hover:bg-gray-100 transition" 
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 font-semibold border-x border-gray-300">{quantity}</span>
                  <button 
                    onClick={() => inCart ? handleUpdateCart('increase') : handleIncrease()} 
                    className="px-4 py-2 hover:bg-gray-100 transition" 
                    disabled={quantity >= (product?.stock ?? 0)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={(product?.stock ?? 0) === 0 || inCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {inCart ? 'In Cart' : 'Add to Cart'}
                </button>

                <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition">
                  Buy Now
                </button>
              </div>
              {/* Benefits */}
              <div className="grid md:hidden grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Free Shipping</h4>
                    <p className="text-xs text-gray-600">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Warranty</h4>
                    <p className="text-xs text-gray-600">{product?.warranty?.available ? `${product?.warranty?.duration ?? 0} months` : 'Not available'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">30-Day Returns</h4>
                    <p className="text-xs text-gray-600">Easy return policy</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900">Fast Delivery</h4>
                    <p className="text-xs text-gray-600">2-3 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:grid hidden grid-cols-4 gap-4">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <Truck className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Free Shipping</h4>
              <p className="text-xs text-gray-600">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Warranty</h4>
              <p className="text-xs text-gray-600">{product?.warranty?.available ? `${product?.warranty?.duration ?? 0} months` : 'Not available'}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <RotateCcw className="w-5 h-5 text-orange-600 mt-1" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">30-Day Returns</h4>
              <p className="text-xs text-gray-600">Easy return policy</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <Zap className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Fast Delivery</h4>
              <p className="text-xs text-gray-600">2-3 business days</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {['description', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 font-semibold capitalize transition ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed">{product?.description}</p>

                {Array.isArray(product?.features) && product.features.length > 0 && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-gray-700">
                          <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.isArray(product?.specifications) && product.specifications.length > 0 ? (
                    product.specifications.map((spec, idx) => (
                      <div key={idx} className="flex border-b border-gray-200 py-3">
                        <span className="font-semibold text-gray-700 w-1/3">{spec?.key}</span>
                        <span className="text-gray-600 w-2/3">{spec?.value}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No specifications available.</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Customer Reviews</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                    Write a Review
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900">{(product?.rating ?? product?.calculatedRating ?? 0).toFixed?.(1)}</div>
                      <div className="flex items-center justify-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{product?.numReviews ?? 0} reviews</div>
                    </div>

                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 w-12">{stars} star</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${stars === 5 ? 75 : stars === 4 ? 20 : 5}%` }} />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">{stars === 5 ? '75%' : stars === 4 ? '20%' : '5%'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {Array.isArray(product?.reviews) && product.reviews.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review?._id ?? review?.id ?? Math.random()} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review?.userName ?? 'User'}</h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < (review?.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">{new Date(review?.createdAt ?? review?.date ?? Date.now()).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review?.comment}</p>
                        <button className="text-sm text-gray-600 hover:text-gray-900">👍 Helpful ({review?.helpful ?? 0})</button>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No reviews yet.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}