'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { productIds } = require('./20240622110441-seed-product');
const { orderIds } = require('./20240620095951-seed-order');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const orderItems = [];
    const numOfOrderItems = 15;

    for (let i = 0; i < numOfOrderItems; i++) {
      const orderId = orderIds[i];
      const productId = productIds[i];

      orderItems.push({
        id: uuidv4(),
        quantity: faker.number.int({ min: 1, max: 10 }),
        price: faker.number.float({ min: 1, max: 1000, fixed: 2 }),
        OrderId: orderId,
        ProductId: productId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Order_item', orderItems, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Order_item', null, {});
  }
};
