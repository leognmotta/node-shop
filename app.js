// Require built-in node functionality
const path = require('path');

// Require Third part packages
const express = require('express');
const bodyParser = require('body-parser');

// Require Controllers
const errorController = require('./controllers/error');

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
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404Page);

// Starts the server
app.listen(3000, () => {
  console.log('http://localhost:3000');
});
