'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { userIds } = require('./20240620091706-seed-user');

let orderIds = [];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = [];
    const numOfOrders = 15;

    for (let i = 0; i < numOfOrders; i++) {
      const userId = userIds[i];

      const orderId = uuidv4();
      orderIds.push(orderId);

      orders.push({
        id: orderId,
        date: faker.date.past(),
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Order', orders, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Order', null, {});
  },
};

module.exports.orderIds = orderIds;
