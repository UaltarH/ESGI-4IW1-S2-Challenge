'use strict';

const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');
const { categoryIds } = require('./20240622105902-seed-category');

let productIds = [];

const cartonNames = {
  'déménagement': [
    'Carton Standard', 'Carton Livre', 'Carton Penderie', 'Carton XXL',
    'Carton Micro-ondes'
  ],
  'bouteilles': [
    'Carton 6 Bouteilles', 'Carton 12 Bouteilles', 'Carton Magnum',
    'Carton Champagne', 'Carton Vin Mousseux'
  ],
  'meubles': [
    'Carton Meuble TV', 'Carton Table Basse', 'Carton Chaise',
    'Carton Commode', 'Carton Bibliothèque'
  ],
  'vêtements': [
    'Carton Garde-robe', 'Carton Chaussures', 'Carton Accessoires',
    'Carton Linge de Maison', 'Carton Vêtements Délicats'
  ]
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const products = [];
    const numOfProducts = 20;

    // Récupérer les catégories existantes
    const categories = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Category";',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (let i = 0; i < numOfProducts; i++) {
      const category = faker.helpers.arrayElement(categories);
      const productId = uuidv4();
      productIds.push(productId);

      products.push({
        id: productId,
        name: faker.helpers.arrayElement(cartonNames[category.name]),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.number.float({ min: 10, max: 20, multipleOf: 0.01 }).toFixed(2)),
        stock: faker.number.int({ min: -10, max: 100 }),
        imagePath: "/products/exemple/cartonExemple.png",
        threshold: faker.number.int({ min: 5, max: 10 }),
        CategoryId: category.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Product', products, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Product', null, {});
  }
};

module.exports.productIds = productIds;