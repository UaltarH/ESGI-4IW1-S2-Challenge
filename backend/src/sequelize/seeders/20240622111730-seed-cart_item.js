'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { productIds } = require('./20240622110441-seed-product');
const { cartIds } = require('./20240622105441-seed-cart');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // const cartItems = [];
    // const numOfCartItems = 15;

    // for (let i = 0; i < numOfCartItems; i++) {
    //   const cartId = cartIds[i];
    //   const productId = productIds[i];

    //   cartItems.push({
    //     id: uuidv4(),
    //     quantity: faker.number.int({ min: 1, max: 10 }),
    //     CartId: cartId,
    //     ProductId: productId,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   });
    // }

    // return queryInterface.bulkInsert('Cart_item', cartItems, {});
  },

  async down(queryInterface, Sequelize) {
    // return queryInterface.bulkDelete('Cart_item', null, {});
  }
};
