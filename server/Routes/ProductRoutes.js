const express = require('express')
const { getProductById, updateProduct, deleteProduct, addProduct, getAllProducts } = require('../Controllers/ProductController')
const router = express.Router()

router.post('/', addProduct)
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

module.exports = router
