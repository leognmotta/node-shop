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
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(productsPath, JSON.stringify(updatedProducts), err => {
          console.log(`getProductsFromFile error: ${err}`);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(productsPath, JSON.stringify(products), err => {
          console.log(`getProductsFromFile error: ${err}`);
        });
      }
    });
  }

  static deleteByid(id) {
    getProductsFromFile(products => {
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(productsPath, JSON.stringify(updatedProducts), err => {
        console.log(`getProductsFromFile error: ${err}`);
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
