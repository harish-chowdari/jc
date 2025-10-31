const express = require("express")
const {
	addToCart,
	getCart,
	updateCartItem,
	removeCartItem,
	clearCart
} = require("../Controllers/CartController")

const router = express.Router()

router.post("/", addToCart)
router.get("/:userId", getCart)
router.put("/update", updateCartItem)
router.delete("/remove", removeCartItem)
router.delete("/clear", clearCart)

module.exports = router
