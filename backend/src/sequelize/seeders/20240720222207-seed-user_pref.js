'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { userIds } = require('./20240620091706-seed-user');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const numUserPrefs = userIds.length;

    for (let i = 0; i < numUserPrefs; i++) {
      await queryInterface.bulkInsert('User_pref', [{
        id: uuidv4(),
        newProduct: true,
        restockProduct: true,
        priceChange: true,
        UserId: userIds[i],
        createdAt: new Date(),
        updatedAt: new Date()
      }]);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User_pref', null, {});
  }
};
