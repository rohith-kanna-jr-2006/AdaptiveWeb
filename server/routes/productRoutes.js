const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validate = require('../middleware/validate');
const { validateGetProducts, validateGetProductById } = require('../validators/productValidator');

router.get('/products', validate(validateGetProducts), productController.getProducts);
router.get('/products/:id', validate(validateGetProductById), productController.getProductById);
router.get('/categories', productController.getCategories);

module.exports = router;
