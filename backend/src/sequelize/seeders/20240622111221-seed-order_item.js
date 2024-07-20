'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { orderIds } = require('./20240620095951-seed-order');
const { productIds } = require('./20240622110441-seed-product');

module.exports = {
  async up(queryInterface, Sequelize) {
    const orderItems = [];

    for (const orderId of orderIds) {
      const numItemsInOrder = faker.number.int({ min: 1, max: 5 });

      for (let i = 0; i < numItemsInOrder; i++) {
        const productId = productIds[faker.number.int({ min: 0, max: productIds.length - 1 })];

        orderItems.push({
          id: uuidv4(),
          quantity: faker.number.int({ min: 1, max: 10 }),
          price: faker.number.float({ min: 1, max: 1000, multipleOf: 0.01 }),
          OrderId: orderId,
          ProductId: productId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    return queryInterface.bulkInsert('Order_item', orderItems, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Order_item', null, {});
  }
};