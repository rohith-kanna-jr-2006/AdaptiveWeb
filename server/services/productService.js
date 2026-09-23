const Product = require('../models/Product');

/**
 * Retrieves paginated product list with minimal payload field projection.
 * @param {Object} queryOptions 
 */
const getProducts = async ({ page = 1, pageSize = 10, category }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.min(50, Math.max(1, parseInt(pageSize, 10) || 10));

  const filter = {};
  if (category && typeof category === 'string' && category.trim() !== '') {
    filter.category = category.trim();
  }

  const skip = (pageNum - 1) * sizeNum;

  // Execute queries in parallel for efficiency
  const [products, totalItems] = await Promise.all([
    Product.find(filter)
      // Minimal list fields projection (omitting full description for reduced payload)
      .select('_id name price category thumbnail image rating stock')
      .skip(skip)
      .limit(sizeNum)
      .lean(),
    Product.countDocuments(filter)
  ]);

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / sizeNum);

  return {
    products,
    pagination: {
      totalItems,
      totalPages,
      currentPage: pageNum,
      pageSize: sizeNum
    }
  };
};

/**
 * Retrieves full product details by ID.
 * @param {string} id 
 */
const getProductById = async (id) => {
  const product = await Product.findById(id).lean();
  return product;
};

/**
 * Retrieves distinct product categories available in MongoDB database.
 */
const getCategories = async () => {
  const categories = await Product.distinct('category');
  return categories.sort();
};

module.exports = {
  getProducts,
  getProductById,
  getCategories
};
