const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	userName: { type: String, required: true },
	rating: { type: Number, required: true, min: 1, max: 5 },
	comment: { type: String, required: true },
	helpful: { type: Number, default: 0 },
	createdAt: { type: Date, default: Date.now }
});

const specificationSchema = new mongoose.Schema({
	key: { type: String, required: true },
	value: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	description: { type: String, required: true },
	price: { type: Number, required: true, min: 0 },
	originalPrice: { type: Number }, // For showing discounts
	category: { type: String, required: true, trim: true },
	brand: { type: String, required: true, trim: true },
	stock: { type: Number, required: true, min: 0, default: 0 },
	
	// Enhanced image handling - multiple images
	images: [{
		url: { type: String, required: true },
		alt: { type: String },
		isPrimary: { type: Boolean, default: false }
	}],
	
	// Ratings
	rating: { type: Number, default: 0, min: 0, max: 5 },
	numReviews: { type: Number, default: 0, min: 0 },
	
	// Reviews array
	reviews: [reviewSchema],
	
	// Key features array
	features: [{ type: String }],
	
	// Technical specifications
	specifications: [specificationSchema],
	
	// Additional fields
	sku: { type: String, unique: true, sparse: true }, // Product SKU
	weight: { type: Number }, // in kg
	dimensions: {
		length: { type: Number },
		width: { type: Number },
		height: { type: Number },
		unit: { type: String, default: "cm" }
	},
	
	// Shipping & warranty
	shippingInfo: {
		freeShipping: { type: Boolean, default: false },
		shippingCost: { type: Number, default: 0 },
		estimatedDays: { type: Number, default: 3 }
	},
	warranty: {
		available: { type: Boolean, default: false },
		duration: { type: Number }, // in months
		details: { type: String }
	},
	
	// Tags for better search
	tags: [{ type: String }],
	
	// SEO
	metaTitle: { type: String },
	metaDescription: { type: String },
	slug: { type: String, unique: true, sparse: true },
	
	// Product status
	isActive: { type: Boolean, default: true },
	isFeatured: { type: Boolean, default: false },
	isOnSale: { type: Boolean, default: false },
	
	// Inventory tracking
	lowStockThreshold: { type: Number, default: 10 },
	
	// Analytics
	viewCount: { type: Number, default: 0 },
	purchaseCount: { type: Number, default: 0 }
}, { 
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
	if (this.originalPrice && this.originalPrice > this.price) {
		return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
	}
	return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
	if (this.stock === 0) return 'out_of_stock';
	if (this.stock <= this.lowStockThreshold) return 'low_stock';
	return 'in_stock';
});

// Virtual for average rating from reviews
productSchema.virtual('calculatedRating').get(function() {
	if (this.reviews && this.reviews.length > 0) {
		const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
		return (sum / this.reviews.length).toFixed(1);
	}
	return this.rating;
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ slug: 1 });

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
	if (this.isModified('name') && !this.slug) {
		this.slug = this.name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}
	
	// Set primary image if not set
	if (this.images && this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
		this.images[0].isPrimary = true;
	}
	
	// Calculate discount
	if (this.originalPrice && !this.price) {
		this.price = this.originalPrice;
	}
	
	next();
});

// Method to add review
productSchema.methods.addReview = function(userId, userName, rating, comment) {
	this.reviews.push({
		user: userId,
		userName: userName,
		rating: rating,
		comment: comment
	});
	
	// Recalculate rating
	const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
	this.rating = totalRating / this.reviews.length;
	this.numReviews = this.reviews.length;
	
	return this.save();
};

// Method to update stock
productSchema.methods.updateStock = function(quantity) {
	this.stock += quantity;
	if (this.stock < 0) this.stock = 0;
	return this.save();
};

// Method to increment view count
productSchema.methods.incrementViews = function() {
	this.viewCount += 1;
	return this.save();
};

// Static method to find products by category
productSchema.statics.findByCategory = function(category) {
	return this.find({ category: category, isActive: true });
};

// Static method to find featured products
productSchema.statics.findFeatured = function(limit = 10) {
	return this.find({ isFeatured: true, isActive: true }).limit(limit);
};

// Static method to find products on sale
productSchema.statics.findOnSale = function(limit = 10) {
	return this.find({ isOnSale: true, isActive: true }).limit(limit);
};

module.exports = mongoose.model("Product", productSchema);