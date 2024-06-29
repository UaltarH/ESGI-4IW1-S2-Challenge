'use strict';
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { orderIds } = require('./20240620095951-seed-order');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const shippings = [];
    const numOfShippings = 15;

    for (let i = 0; i < numOfShippings; i++) {
      const orderId = orderIds[i];

      shippings.push({
        id: uuidv4(),
        OrderId: orderId,
        shippingMethod: faker.helpers.arrayElement(['standard', 'express']),
        trackingNumber: faker.number.int({ min: 10000 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Shipping', shippings, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Shipping', null, {});
  }
};
