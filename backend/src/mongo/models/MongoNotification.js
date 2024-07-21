const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: String,
    roleUser: String,   //['user', 'admin']
    typeNotification: String,  //['newProduct', 'restockProduct', 'priceChange'], admin: ['noStock', 'lowStock']
    message: String,
    read: Boolean,
    createdAt: Date,
    updatedAt: Date,
});

const MongoNotification = mongoose.model('Notification', notificationSchema);

module.exports = MongoNotification;