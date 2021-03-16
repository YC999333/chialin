const Product = require('../Models/product');
const Order = require('../Models/order');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { ObjectId } = require('mongodb');
const order = require('../Models/order');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_user: process.env.API_USER,
    },
  })
);

exports.getVegProducts = (req, res, next) => {
  const category = 'veg';

  Product.find({ category })
    .then((products) => {
      res.render('shop/products-veg', {
        prods: products,
        pageTitle: 'Menu',
        path: '/veg-menu',
      });
    })
    .catch((err) => console.log(err));
};

exports.getMeatProducts = (req, res, next) => {
  const category = 'meat';

  Product.find({ category })
    .then((products) => {
      return res.render('shop/products-meat', {
        prods: products,
        pageTitle: 'Meat Menu',
        path: '/meat-menu',
      });
    })
    .catch((err) => console.log(err));
};

exports.getFishProducts = (req, res, next) => {
  const category = 'fish';

  Product.find({ category })
    .then((products) => {
      return res.render('shop/products-fish', {
        prods: products,
        pageTitle: 'Fish Menu',
        path: '/fish-menu',
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: '佳林會客菜',
    path: '/',
  });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId') //path you want to populate
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      // console.log(products);
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      // console.log(user.cart.items);
      const products = user.cart.items.map((i) => {
        // console.log(i.productId); Object related to productId in user model
        return { quantity: i.quantity, product: { ...i.productId._doc } }; //attach all product info in product
      });

      // console.log(products);
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user._id,
          phone: req.user.phone,
        },
        products: products,
        pickUpDate: req.body.pickUpDate,
        pickUpTime: req.body.pickUpTime,
        total: req.body.total,
      });
      order.save();

      const mailList = ['yc99993333@gmail.com'];

      res.render(
        'shop/order-confirmation',
        {
          pageTitle: 'Your Order!',
          path: '/order',
          order,
        },
        function (err, html) {
          if (err) {
            console.log(err);
          } else {
            transporter.sendMail({
              to: mailList,
              from: 'yc99993333@gmail.com',
              subject: '感謝您的訂購!',
              html: html,
            });
          }
        }
      );

      res.render('shop/order', {
        pageTitle: 'Your Order!',
        path: '/order',
        order,
      });
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .catch((err) => console.log(err));
};

exports.getUserOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/userOrders', {
        pageTitle: 'Your Order',
        path: '/userOrders',
        orders,
      });
    })
    .catch((err) => console.log(err));
};
