const Product = require('../Models/product');

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn,
  });
}; //1st argument: views

exports.postAddProduct = (req, res, next) => {
  const { title, price, category } = req.body;
  const product = new Product({
    title,
    price,
    category,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      // console.log(category);
      if (category === 'veg') {
        return res.redirect('/veg-menu');
      } else if (category === 'veg') {
        return res.redirect('/meat-menu');
      } else {
        return res.redirect('/fish-menu');
      }
    })
    .catch((err) => console.log(err));
}; //immediately save to database

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn, //from postLoggedIn in auth.js
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId; //params.id get id from url
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId; //productId extract from name="productId"
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;

  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;

      return product.save();
    })
    .then((result) => {
      console.log('Updated Product');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findByIdAndDelete(prodId)
    .then(() => {
      console.log('Destroyed Product');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
