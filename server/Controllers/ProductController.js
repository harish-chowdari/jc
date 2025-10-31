const Product = require("../Models/ProductModel")

const addProduct = async (req, res) => {
	try {
        console.log("Incoming Body:", req.body)

        const { name, description, price, category, brand, stock, images } = req.body
		const product = new Product({ name, description, price, category, brand, stock, images })
		await product.save()
		return res.status(201).json(product)
	} catch (error) {
		return res.status(400).json({ message: error.message })
	}
}

const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find()
		return res.status(200).json(products)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id)
		if (!product) return res.status(404).json({ message: "Product not found" })
		return res.status(200).json(product)
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

const updateProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
		if (!product) return res.status(404).json({ message: "Product not found" })
		return res.status(200).json(product)
	} catch (error) {
		return res.status(400).json({ message: error.message })
	}
}

const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id)
		if (!product) return res.status(404).json({ message: "Product not found" })
		return res.status(200).json({ message: "Product deleted successfully" })
	} catch (error) {
		return res.status(500).json({ message: error.message })
	}
}

module.exports = { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct }
