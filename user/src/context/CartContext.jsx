import React, { createContext, useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import getUserId from '../utils/getUserId'

export const CartContext = createContext({})

export function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [loading, setLoading] = useState(false)
	const userId = getUserId()

	const refreshCart = async () => {
		if (!userId) return null
		try {
			setLoading(true)
			const res = await axios.get(`http://localhost:5000/api/cart/${userId}`)
			const filteredItems = res.data.items?.filter(i => i.quantity > 0) || []
			const updated = { ...res.data, items: filteredItems }
			setCart(updated)
			return updated
		} catch (err) {
			console.error('Cart refresh error', err)
			return null
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		refreshCart()
	}, [userId])

	const cartCount = useMemo(() => {
		if (!cart?.items) return 0
		return cart.items.reduce((sum, it) => sum + (it.quantity || 0), 0)
	}, [cart])

	return (
		<CartContext.Provider value={{ cart, setCart, refreshCart, loading, cartCount }}>
			{children}
		</CartContext.Provider>
	)
}
