const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post(
  '/add-product',
  [
    body('title', 'Please enter a title with at least 3 characters')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'Image most be valid url.').isURL(),
    body('price', 'Please enter a decimal value "0.00" ').isCurrency({
      require_decimal: true,
      digits_after_decimal: [2]
    }),
    body('description', 'Please enter a description with at least 5 characters')
      .isLength({ min: 5 })
      .trim()
  ],
  isAuth,
  adminController.postAddProduct
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
  '/edit-product',
  [
    body('title', 'Please enter a title with at least 3 characters')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'Image most be valid url.').isURL(),
    body('price', 'Please enter a decimal value "0.00" ').isCurrency({
      require_decimal: true,
      digits_after_decimal: [2]
    }),
    body('description', 'Please enter a description with at least 5 characters')
      .isLength({ min: 5 })
      .trim()
  ],
  isAuth,
  adminController.postEditProduct
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
