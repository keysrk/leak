const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createProduct,
  updateProduct,
  getProduct,
  getFactoryProducts,
  deleteProduct,
  upload
} = require('../controllers/productController');

// All routes require authentication
router.use(auth);

// Product management routes
router.post('/', upload, createProduct);
router.get('/', getFactoryProducts);
router.get('/:id', getProduct);
router.patch('/:id', upload, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
