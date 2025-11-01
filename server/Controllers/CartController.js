const Cart = require("../Models/CartModel")
const Product = require("../Models/ProductModel")

const calculateTotal = async (cart) => {
	let total = 0
	for (const item of cart.items) {
		const product = await Product.findById(item.productId)
		if (product) total += product.price * item.quantity
	}
	cart.totalPrice = total
	await cart.save()
	return cart
}

const addToCart = async (req, res) => {
	try {
		const { userId, productId, quantity } = req.body
		if (!userId || !productId) return res.status(400).json({ message: "userId and productId required" })

		let cart = await Cart.findOne({ userId })
		if (!cart) cart = new Cart({ userId, items: [] })

		const existingItem = cart.items.find((item) => item.productId.toString() === productId)
		if (existingItem) {
			existingItem.quantity += quantity
		} else {
			cart.items.push({ productId, quantity })
		}

		await cart.save()
		await calculateTotal(cart)
		await cart.populate("items.productId")
		res.status(200).json(cart)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

const getCart = async (req, res) => {
	try {
		const { userId } = req.params
		let cart = await Cart.findOne({ userId }).populate("items.productId")
		if (!cart) return res.status(404).json({ message: "Cart not found" })
		// filter out items with zero or negative quantity
		cart.items = cart.items.filter((i) => i.quantity > 0)
		await calculateTotal(cart)
		res.status(200).json(cart)
	} catch (error) {
		res.status(500).json({ message: error.message })
	}
}

const updateCartItem = async (req, res) => {
	try {
		const { userId, productId, quantity } = req.body
		const cart = await Cart.findOne({ userId })
		if (!cart) return res.status(404).json({ message: "Cart not found" })

		const productIdStr = productId.toString()
		const item = cart.items.find((i) => i.productId.toString() === productIdStr)

		if (!item) return res.status(404).json({ message: "Product not found in cart" })

		if (quantity <= 0) {
			cart.items = cart.items.filter((i) => i.productId.toString() !== productIdStr)
		} else {
			item.quantity = quantity
		}

		await cart.save()
		await calculateTotal(cart)
		await cart.populate("items.productId")
		res.status(200).json(cart)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

const removeCartItem = async (req, res) => {
	try {
		const { userId, productId } = req.body
		const cart = await Cart.findOne({ userId })
		if (!cart) return res.status(404).json({ message: "Cart not found" })

		cart.items = cart.items.filter((item) => item.productId.toString() !== productId.toString())
		await cart.save()
		await calculateTotal(cart)
		await cart.populate("items.productId")
		res.status(200).json(cart)
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

const clearCart = async (req, res) => {
	try {
		const { userId } = req.body
		const cart = await Cart.findOne({ userId })
		if (!cart) return res.status(404).json({ message: "Cart not found" })

		cart.items = []
		cart.totalPrice = 0
		await cart.save()
		res.status(200).json({ message: "Cart cleared successfully", cart })
	} catch (error) {
		res.status(400).json({ message: error.message })
	}
}

module.exports = { addToCart, getCart, updateCartItem, removeCartItem, clearCart }
