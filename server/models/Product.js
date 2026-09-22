const mongoose = require('mongoose');

const ImageVariantsSchema = new mongoose.Schema({
  small: { type: String, required: [true, 'Small image variant URL is required'] },
  medium: { type: String, required: [true, 'Medium image variant URL is required'] },
  large: { type: String, required: [true, 'Large image variant URL is required'] }
}, { _id: false });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be non-negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    index: true
  },
  image: {
    type: ImageVariantsSchema,
    required: [true, 'Product image asset variants are required']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail image URL is required'],
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  }
}, {
  timestamps: true
});

// Compound index for category and price queries
ProductSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', ProductSchema);
