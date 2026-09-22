const productService = require('../services/productService');

/**
 * GET /api/products
 * Returns paginated product list with minimal summary fields.
 */
const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Returns single product details by ID.
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Product not found with ID '${req.params.id}'`
        }
      });
    }

    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/categories
 * Returns distinct list of product categories.
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getCategories
};
