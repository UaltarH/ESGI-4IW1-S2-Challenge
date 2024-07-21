const { Product, Category, User, Order, Order_item, Payment, Shipping, Order_status } = require('../models');
const MongoProduct = require('../../mongo/models/MongoProduct');
const MongoOrder = require('../../mongo/models/MongoOrder');
const MongoAppHistory = require('../../mongo/models/MongoAppHistory');
const MongoDashboardConfig = require('../../mongo/models/MongoDashboardConfig');
const MongoNotification = require('../../mongo/models/MongoNotification');
const mongoose = require('mongoose');
const { createMongoOrder } = require('../../services/mongoOrderService');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB for migration');

    //product
    const products = await Product.findAll({
      include: {
        model: Category,
      }
    });

    for (const product of products) {
      await MongoProduct.create({
        postgresId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imagePath: product.imagePath,
        threshold: product.threshold,
        categoryId: product.Category.id,
        categoryName: product.Category.name,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    }

    //orders
    const orders = await Order.findAll({
      include: [
        { model: Order_item },
        { model: Payment },
        { model: Shipping },
        { model: Order_status }
      ]
    });

    for (const order of orders) {
      const orderItemsRes = await Order_item.findAll({ where: { OrderId: order.id } });
      const orderStatusRes = await Order_status.findAll({ where: { OrderId: order.id } });
      const paymentRes = await Payment.findOne({ where: { OrderId: order.id } });
      const shippingRes = await Shipping.findOne({ where: { OrderId: order.id } });

      await createMongoOrder(order, order.UserId, orderItemsRes, paymentRes, shippingRes, orderStatusRes);
    }

    //notifications
    const users = await User.findAll();
    const notificationTypes = {
      user: ['newProduct', 'restockProduct', 'priceChange'],
      admin: ['noStock', 'lowStock']
    };

    const notificationMessages = {
      user: {
        newProduct: 'Nouveau produit {product} est disponible',
        restockProduct: 'Le produit {product} est de nouveau disponible',
        priceChange: 'Le produit {product} a changé de prix'
      },
      admin: {
        noStock: 'Alerte stock: le produit {product} est en rupture de stock',
        lowStock: 'Alerte stock: le produit {product} a un stock faible'
      }
    };

    for (const user of users) {
      const roleNotifications = notificationTypes[user.role] || notificationTypes.user;

      for (const type of roleNotifications) {
        const message = notificationMessages[user.role][type].replace('{product}', 'ExempleProduit');

        await MongoNotification.create({
          userId: user.id,
          roleUser: user.role,
          typeNotification: type,
          message: message,
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    console.log('Data migrated successfully');
  },

  async down(queryInterface, Sequelize) {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB for migration rollback');

    await MongoProduct.deleteMany({});
    await MongoOrder.deleteMany({});
    await MongoAppHistory.deleteMany({});
    await MongoDashboardConfig.deleteMany({});
    await MongoNotification.deleteMany({});
    console.log('Migration rollback completed successfully');
  }
};