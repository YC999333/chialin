const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const path = require('path');
const errorController = require('./Controllers/error');

const User = require('./Models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = process.env.MONGODB_URI;
const csrf = require('csurf');
const flash = require('connect-flash');
const user = require('./Models/user');

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store, //session data stored in here
  })
);

app.use(csrfProtection); //must be after session
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user; // save user to req.user
      next();
    })
    .catch((err) => console.log(err));
}); //middleware, runs User.findById, access to users in database. only runs when there's req

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.isAdmin = req.session.isAdmin;
  res.locals.csrfToken = req.csrfToken();
  next();
}); //must add  <input type="hidden" name="_csrf" value="<%= csrfToken %>"> in all post form

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => {
    const port = process.env.PORT;
    app.listen(port || 3000);
    console.log('Connected');
  })
  .catch((err) => console.log(err));
