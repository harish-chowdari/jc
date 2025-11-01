import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Tag, Truck, Shield, CreditCard, AlertCircle, Loader, Package, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import getUserId from '../utils/getUserId';
import Header from '../components/Header';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);
  const userId = getUserId();

  useEffect(() => {
    fetchCart();
  }, []);

 const fetchCart = async () => {
	try {
		setLoading(true)
		setError(null)
		const res = await axios.get(`http://localhost:5000/api/cart/${userId}`)
		// filter items with quantity > 0 for UI safety
		const filteredItems = res.data.items?.filter(item => item.quantity > 0) || []
		setCart({ ...res.data, items: filteredItems })
	} catch (err) {
		console.error('Error fetching cart:', err)
		setError(err.response?.data?.message || 'Failed to load cart')
	} finally {
		setLoading(false)
	}
}

const clearCart = async () => {
	if (!window.confirm('Are you sure you want to clear your cart?')) return
	try {
		setLoading(true)
		await axios.post('http://localhost:5000/api/cart/clear', { userId })
		setCart({ items: [], totalPrice: 0 })
	} catch (err) {
		console.error('Error clearing cart:', err)
		alert('Failed to clear cart')
	} finally {
		setLoading(false)
	}
}


  const updateQuantity = async (productId, newQuantity) => {
    try {
      setUpdating(productId);
      await axios.put('http://localhost:5000/api/cart/update', {
        userId,
        productId,
        quantity: newQuantity
      });
      await fetchCart();
    } catch (err) {
      console.error('Error updating cart:', err);
      alert('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setUpdating(productId);
      await axios.post('http://localhost:5000/api/cart/remove', {
        userId,
        productId
      });
      await fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 250 ? 0 : 15; // Updated threshold for AED
  const tax = subtotal * 0.05; // 5% VAT in UAE
  const total = subtotal + shipping + tax;

  if (loading && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {isEmpty ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="bg-gray-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Add some amazing products to get started!</p>
            <button
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Cart Items ({cart.items.length})
                </h2>
                {cart.items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </button>
                )}
              </div>

              {cart.items.map((item) => {
                const product = item.productId;
                const isUpdating = updating === product?._id;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={product?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                          alt={product?.name}
                          className="w-full sm:w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                          onClick={() => navigate(`/product-details/${product?._id}`)}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 
                              className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 cursor-pointer hover:text-blue-600 transition"
                              onClick={() => navigate(`/product-details/${product?._id}`)}
                            >
                              {product?.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                              {product?.description}
                            </p>
                            <div className="flex items-center space-x-3 text-sm">
                              <span className="text-blue-600 font-medium">{product?.brand}</span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{product?.category}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removeItem(product?._id)}
                            disabled={isUpdating}
                            className="text-gray-400 hover:text-red-600 transition ml-4 disabled:opacity-50"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-2xl font-bold text-gray-900">
                            AED {(product?.price * item.quantity).toFixed(2)}
                          </div>

                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(product?._id, item.quantity - 1)}
                              disabled={isUpdating || item.quantity <= 1}
                              className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 p-2 rounded-lg transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <span className="text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                              {isUpdating ? '...' : item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(product?._id, item.quantity + 1)}
                              disabled={isUpdating || item.quantity >= product?.stock}
                              className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 p-2 rounded-lg transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stock Warning */}
                        {product?.stock < 10 && product?.stock > 0 && (
                          <div className="mt-2 text-sm text-orange-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Only {product.stock} left in stock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">AED {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `AED ${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>VAT (5%)</span>
                    <span className="font-semibold">AED {tax.toFixed(2)}</span>
                  </div>

                  {subtotal < 250 && subtotal > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Add AED {(250 - subtotal).toFixed(2)} more for FREE shipping!
                    </div>
                  )}

                  <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 mb-4">
                  <CreditCard className="w-5 h-5 inline mr-2" />
                  Proceed to Checkout
                </button>

                {/* Features */}
                <div className="space-y-3 pt-6 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <Truck className="w-5 h-5 text-green-600" />
                    </div>
                    <span>Free shipping on orders over AED 250</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>2-year warranty included</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="bg-purple-100 p-2 rounded-lg mr-3">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <span>Easy 30-day returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}