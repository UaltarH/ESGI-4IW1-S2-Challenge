'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { userIds } = require('./20240620091706-seed-user');

let cartIds = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const carts = [];
    const numOfCarts = 15;

    for (let i = 0; i < numOfCarts; i++) {
      const userId = userIds[i];

      const cartId = uuidv4();
      cartIds.push(cartId);

      carts.push({
        id: cartId,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Cart', carts, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Cart', null, {});
  }
};

module.exports.cartIds = cartIds;
