// Require built-in node functionality
const path = require('path');

// Require Third part packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Require Controllers
const errorController = require('./controllers/error');

// Require models
const User = require('./models/user');

// Require utilities
const rootDir = require('./util/path');

// Creates express app
const app = express();

// Set template engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Require routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Third Part Set UP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootDir, 'public')));

// Middlewares

app.use((req, res, next) => {
  User.findById('5c2551bdc00f192065550b9b')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404Page);

mongoose
  .connect(
    'mongodb+srv://leomotta121:db386486@cluster0-sud5s.mongodb.net/shop?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Leo',
          email: 'leo@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });

    app.listen(3000, () => {
      console.log('App listening on port 3000!');
    });
  })
  .catch(err => console.log(err));
