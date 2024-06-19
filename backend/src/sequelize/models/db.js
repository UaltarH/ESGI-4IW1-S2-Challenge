const { Sequelize } = require('sequelize');
const conf = require('../../config/sequelize_config');

const { url, ...options } = conf[process.env.NODE_ENV || 'development'];

const connection = new Sequelize(url, options)


module.exports = connection;