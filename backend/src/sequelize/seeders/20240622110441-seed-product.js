'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker, de } = require('@faker-js/faker');
const { categoryIds } = require('./20240622105902-seed-category');

let productIds = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = [];
    const numOfProducts = 15;

    for (let i = 0; i < numOfProducts; i++) {
      const categoryId = faker.helpers.arrayElement(categoryIds)

      const productId = uuidv4();
      productIds.push(productId);

      products.push({
        id: productId,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.number.float({ min: 10, max: 20, precision: 0.01 }).toFixed(2)),
        stock: faker.number.int({ min: -10, max: 100 }),
        CategoryId: categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Product', products, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Product', null, {});
  }
};

module.exports.productIds = productIds
