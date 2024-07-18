'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

let categoryIds = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const uniqueCategories = () => {
      const categoryNames = ['déménagement', 'bouteilles', 'meubles', 'vêtements'];
      const categories = [];
      const numOfCategories = 3;

      for (let i = 0; i < numOfCategories; i++) {
        const categoryId = uuidv4();
        categoryIds.push(categoryId);
        const randomIndex = Math.floor(Math.random() * categoryNames.length);
        const categoryName = categoryNames.splice(randomIndex, 1)[0]; // Extraire et supprimer l'élément

        categories.push({
          id: categoryId,
          name: categoryName,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return categories;
    };

    const categories = uniqueCategories();
    return queryInterface.bulkInsert('Category', categories, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Category', null, {});
  }
};

module.exports.categoryIds = categoryIds
