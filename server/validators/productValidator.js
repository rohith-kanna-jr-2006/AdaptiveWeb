const mongoose = require('mongoose');

/**
 * Validates query parameters for GET /api/products
 */
const validateGetProducts = (req) => {
  const { page, pageSize, category } = req.query;

  if (page !== undefined) {
    const pageNum = Number(page);
    if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1) {
      return 'Query parameter page must be a positive integer >= 1';
    }
  }

  if (pageSize !== undefined) {
    const sizeNum = Number(pageSize);
    if (isNaN(sizeNum) || !Number.isInteger(sizeNum) || sizeNum < 1 || sizeNum > 50) {
      return 'Query parameter pageSize must be an integer between 1 and 50';
    }
  }

  if (category !== undefined && typeof category !== 'string') {
    return 'Query parameter category must be a string';
  }

  return null; // Valid
};

/**
 * Validates route parameters for GET /api/products/:id
 */
const validateGetProductById = (req) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return 'Product ID parameter is required';
  }

  // Check valid 24-character hex MongoDB ObjectId format
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;
  if (!isValidObjectId) {
    return 'Invalid product ID format. Must be a valid 24-character hexadecimal ObjectId';
  }

  return null; // Valid
};

module.exports = {
  validateGetProducts,
  validateGetProductById
};
