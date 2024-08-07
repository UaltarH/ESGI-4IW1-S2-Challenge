'use strict';
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { orderIds } = require('./20240620095951-seed-order');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const payments = [];
    const numOfPayments = orderIds.length;
    for (let i = 0; i < numOfPayments; i++) {
      const orderId = orderIds[i];

      payments.push({
        id: uuidv4(),
        OrderId: orderId,
        stripeSessionId: faker.number.int({ min: 10000, max: 999990 }),
        amount: faker.number.float({ min: 50, max: 150, multipleOf: 0.01 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Payment', payments, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Payment', null, {});
  }
};
