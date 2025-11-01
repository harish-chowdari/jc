import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Plus, Minus, Star } from 'lucide-react'
import axios from 'axios'
import getUserId from '../utils/getUserId'

const ProductCard = ({ product }) => {
	const navigate = useNavigate()
	const userId = getUserId()
	const [quantity, setQuantity] = useState(0)
	const [loading, setLoading] = useState(false)

	const formatAED = (value) => {
		if (value === null || value === undefined || Number.isNaN(Number(value))) return ''
		try {
			return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(Number(value))
		} catch (err) {
			return `د.إ ${Number(value).toFixed(2)}`
		}
	}

	const fetchCart = async () => {
		try {
			const res = await axios.get(`http://localhost:5000/api/cart/${userId}`)
			const cartItems = res?.data?.items || []
			const found = cartItems.find((item) => item?.productId?._id === product?._id)
			setQuantity(found?.quantity || 0)
		} catch (err) {
			console.error('Error fetching cart:', err?.response?.data || err?.message)
		}
	}

	const addToCart = async (e) => {
		e.stopPropagation()
		try {
			setLoading(true)
			const res = await axios.post('http://localhost:5000/api/cart', {
				userId,
				productId: product?._id,
				quantity: 1
			})
			setQuantity(1)
			alert(res?.data?.message || 'Product added to cart!')
		} catch (error) {
			console.error('Add to cart error:', error?.response?.data || error?.message)
			alert('Failed to add product.')
		} finally {
			setLoading(false)
		}
	}

	const updateCart = async (e, action) => {
		e.stopPropagation()
		try {
			setLoading(true)
			const newQuantity = action === 'increase' ? quantity + 1 : quantity - 1
			await axios.put('http://localhost:5000/api/cart/update', {
				userId,
				productId: product?._id,
				quantity: newQuantity
			})
			setQuantity(newQuantity)
		} catch (error) {
			console.error('Cart update failed:', error?.response?.data || error?.message)
			alert('Failed to update cart.')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (userId && product?._id) fetchCart()
	}, [userId, product?._id])

	return (
		<div 
			onClick={() => navigate(`/product-details/${product?._id}`)} 
			className='bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-2 cursor-pointer overflow-hidden'
		>
			<div className='relative'>
				<img 
					src={
						product?.images?.[0]?.url || 
						(typeof product?.images?.[0] === 'string' ? product?.images?.[0] : '') ||
						'https://via.placeholder.com/300x200?text=No+Image'
					} 
					alt={product?.images?.[0]?.alt || product?.name} 
					className='w-full h-48 object-cover' 
				/>

				{product?.stock < 10 && product?.stock > 0 && (
					<div className='absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold'>
						Only {product?.stock} left
					</div>
				)}
				{product?.stock === 0 && (
					<div className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold'>
						Out of Stock
					</div>
				)}
			</div>

			<div className='p-4'>
				<h3 className='font-semibold text-gray-800 mb-1 truncate'>{product?.name}</h3>
				<p className='text-xs text-gray-500 mb-2 truncate'>{product?.description}</p>
				<p className='text-xs text-blue-600 mb-2'>
					{product?.brand} • {product?.category}
				</p>

				<div className='flex items-center justify-between'>
					<div>
						<span className='text-lg font-bold text-gray-800'>{formatAED(product?.price)}</span>
					</div>

					{quantity > 0 ? (
						<div 
							className='flex items-center space-x-2'
							onClick={(e) => e.stopPropagation()}
						>
							<button
								disabled={loading}
								onClick={(e) => updateCart(e, 'decrease')}
								className='bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-lg transition disabled:opacity-50'
							>
								<Minus className='w-4 h-4' />
							</button>
							<span className='text-sm font-semibold'>{quantity}</span>
							<button
								disabled={loading}
								onClick={(e) => updateCart(e, 'increase')}
								className='bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-lg transition disabled:opacity-50'
							>
								<Plus className='w-4 h-4' />
							</button>
						</div>
					) : (
						<button
							onClick={addToCart}
							disabled={loading || product?.stock === 0}
							className={`${
								product?.stock === 0
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-blue-600 hover:bg-blue-700'
							} text-white p-2 rounded-lg transition disabled:opacity-50`}
						>
							<ShoppingCart className='w-5 h-5' />
						</button>
					)}
				</div>
			</div>
		</div>
	)
}

export default ProductCard
