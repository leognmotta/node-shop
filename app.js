// Require built-in node functionality
const path = require('path');

// Require Third part packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

// Require Controllers
const errorController = require('./controllers/error');

// Require models
const User = require('./models/user');

// Require utilities
const rootDir = require('./util/path');
const links = require('./util/uri');

const MONGODB_URI = links.databaseUri;

// Creates express app
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

// Set template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Require routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Third Part Set UP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());

// Middlewares
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/', errorController.get404Page);

mongoose
  .connect(
    MONGODB_URI,
    { useNewUrlParser: true }
  )
  .then(result => {
    app.listen(3000, () => {
      console.log('App listening on port 3000!');
    });
  })
  .catch(err => console.log(err));
