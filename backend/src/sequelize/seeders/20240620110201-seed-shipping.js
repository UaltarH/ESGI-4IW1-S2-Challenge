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
        status: faker.helpers.arrayElement(["En attente d'expédition", 'En livraison', 'En attente', 'Problème de livraison']),
        OrderId: orderId,
        shippingMethod: faker.helpers.arrayElement(['standard', 'express']),
        trackingNumber: faker.helpers.arrayElement(['40333870114531', '14804899007121', '39138761900988']),
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
