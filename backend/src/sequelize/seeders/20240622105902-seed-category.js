'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

let categoryIds = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [];
    const numOfCategories = 3;

    for (let i = 0; i < numOfCategories; i++) {
      const categoryId = uuidv4();
      categoryIds.push(categoryId);

      categories.push({
        id: categoryId,
        name: faker.helpers.arrayElement(['démenagement', 'bouteilles', 'meubles', 'vêtements']),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Category', categories, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Category', null, {});
  }
};

module.exports.categoryIds = categoryIds
