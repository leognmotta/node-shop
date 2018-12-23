// Require built-in node functionality
const path = require('path');

// Require Third part packages
const express = require('express');
const bodyParser = require('body-parser');

// Require Controllers
const errorController = require('./controllers/error');

// Require database
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use('/', errorController.get404Page);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(result => {
    return User.findByPk(1);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Leo', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    localUser = user;
    return localUser.getCart();
  })
  .then(cart => {
    if (!cart) {
      return localUser.createCart();
    }
    return cart;
  })
  .then(cart => {
    // console.log(user);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
