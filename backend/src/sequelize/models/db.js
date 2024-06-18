const {Sequelize} = require('sequelize');
const conf = require('../../config/sequelize_config');

const {url, ...options} = conf[process.env.NODE_ENV || 'development'];

const connection =  new Sequelize(url, options)

connection.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}   ).catch((error) => {
    console.error('Unable to connect to the database:', error);
});

module.exports = connection;