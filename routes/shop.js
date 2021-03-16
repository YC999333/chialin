const express = require('express');
const { getEditProduct } = require('../Controllers/admin');
const router = express.Router();
const shopController = require('../Controllers/shop');
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndex);

router.get('/veg-menu', shopController.getVegProducts);

router.get('/meat-menu', shopController.getMeatProducts);

router.get('/fish-menu', shopController.getFishProducts);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/order', isAuth, shopController.postOrder);

// router.post('/order', isAuth, shopController.getOrder);

router.get('/userOrders', isAuth, shopController.getUserOrders);

module.exports = router;
