const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const productsPath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = cb => {
  fs.readFile(productsPath, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      try {
        cb(JSON.parse(fileContent));
      } catch {
        cb([]);
      }
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      products.push(this);
      fs.writeFile(productsPath, JSON.stringify(products), err => {
        console.log(`getProductsFromFile error: ${err}`);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
