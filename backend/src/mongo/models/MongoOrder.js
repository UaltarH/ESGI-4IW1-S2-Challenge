const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    postgresId: String,
    orderNumber: String,
    date: Date,
    user: {
        userId: String,
        firstname: String,
        lastname: String,
        email: String,
        phone: String,
    },
    status: [
        {
            statusId: String,
            status: {
                type: String,
                enum: ["En attente", "Confirmée", "Expédiée", "Livrée", "Annulée", "Remboursée"],
            },
            date: Date,
        },
    ],
    orderItems: [
        {
            orderItemId: String,
            productId: String,
            productName: String,
            price: Number,
            quantity: Number,
        },
    ],
    payment: {
        paymentId: String,
        stripeSessionId: String,
        amount: Number,
    },
    shipping: {
        shippingId: String,
        shippingMethod: {
            type: String,
            enum: ["standard", "express"],
        },
        trackingNumber: Number,
        address: String,
        city: String,
        zipcode: Number,
        country: {
            type: String,
            default: "France",
        },
    },
});

const MongoOrder = mongoose.model('Order', orderSchema);

module.exports = MongoOrder;