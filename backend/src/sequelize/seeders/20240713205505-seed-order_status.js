'use strict';
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { orderIds } = require('./20240620095951-seed-order');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let allOrderStatus = [];

    for (let i = 0; i < orderIds.length; i++) {
      const orderId = orderIds[i];

      const orderStatusSet = new Set();
      const numOfOrderStatus = faker.number.int({ min: 1, max: 3 });

      while (orderStatusSet.size < numOfOrderStatus) {
        orderStatusSet.add(faker.helpers.arrayElement(['En attente', 'Confirmée', 'Expédiée', 'Livrée', 'Annulée', 'Remboursée']));
      }

      const orderStatus = Array.from(orderStatusSet).map(status => ({
        id: uuidv4(),
        OrderId: orderId,
        status: status,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      allOrderStatus = allOrderStatus.concat(orderStatus);
    }
    await queryInterface.bulkInsert('Order_status', allOrderStatus, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Order_status', null, {});
  }
};
