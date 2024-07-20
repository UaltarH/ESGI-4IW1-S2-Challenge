'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { userIds } = require('./20240620091706-seed-user');

let orderIds = [];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const orders = [];
    const numOfOrders = 200;

    const startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    const endDate = new Date();

    const ordersByDate = {};

    for (let i = 0; i < numOfOrders; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const orderId = uuidv4();
      orderIds.push(orderId);

      let orderDate = faker.date.between({ from: startDate, to: endDate });

      if (i > 0 && Math.random() < 0.5) { // 30% de chance d'utiliser une date existante
        const existingDates = Object.keys(ordersByDate);
        if (existingDates.length > 0) {
          orderDate = new Date(existingDates[Math.floor(Math.random() * existingDates.length)]);
        }
      }

      const dateString = orderDate.toISOString().split('T')[0];

      if (!ordersByDate[dateString]) {
        ordersByDate[dateString] = [];
      }
      ordersByDate[dateString].push({
        id: orderId,
        orderNumber: faker.number.int({ min: 111111, max: 9999999 }),
        date: orderDate,
        UserId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    Object.keys(ordersByDate).sort().forEach(date => {
      orders.push(...ordersByDate[date]);
    });

    return queryInterface.bulkInsert('Order', orders, {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Order', null, {});
  },
};

module.exports.orderIds = orderIds;