'use strict';
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { orderIds } = require('./20240620095951-seed-order');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const shippings = [];
    const numOfShippings = orderIds.length;

    for (let i = 0; i < numOfShippings; i++) {
      const orderId = orderIds[i];

      shippings.push({
        id: uuidv4(),
        OrderId: orderId,
        shippingMethod: faker.helpers.arrayElement(['standard', 'express']),
        trackingNumber: parseInt(faker.helpers.arrayElement(['5113090', '107121', '900988'])),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        zipcode: Number(faker.location.zipCode("####")),
        country: faker.location.country(),
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
