'use strict';

const { v4: uuidv4 } = require('uuid');

let categoryIds = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categoryNames = ['déménagement', 'bouteilles', 'meubles', 'vêtements'];
    const categories = categoryNames.map(name => {
      const categoryId = uuidv4();
      categoryIds.push(categoryId);
      return {
        id: categoryId,
        name: name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return queryInterface.bulkInsert('Category', categories, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Category', null, {});
  }
};

module.exports.categoryIds = categoryIds;