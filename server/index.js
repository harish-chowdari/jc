const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require("./db")

const AuthRoutes = require("./Routes/AuthRoutes")
const OtpRouter = require("./Routes/OtpRoutes")
const ProductRoutes = require("./Routes/ProductRoutes")
const CartRoutes = require("./Routes/CartRoutes")

app.use("/api", AuthRoutes)
app.use("/api", OtpRouter)
app.use("/api/products", ProductRoutes)
app.use("/api/cart", CartRoutes)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))
