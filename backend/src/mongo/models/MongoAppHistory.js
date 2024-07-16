const mongoose = require('mongoose');

const appHistorySchema = new mongoose.Schema({
    date: Date,
    userDeleted: {
        userId: String,
        firstname: String,
        lastname: String,
        email: String,
        phone: String,
        address: String,
        city: String,
        zipcode: Number,
        country: {
            type: String,
            default: "France",
        },
        birthdate: Date,
        role: {
            type: String,
            enum: ["admin", "user", "store_manager", "accountant"],
            default: "user",
        },
    },
    ordersDeleted: [
        {
            orderId: String,
            date: Date,
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
                paymentMethod: {
                    type: String,
                    enum: ["credit_card", "paypal"],
                },
                amount: Number,
            },
            shipping: {
                shippingId: String,
                shippingMethod: {
                    type: String,
                    enum: ["standard", "express"],
                },
                trackingNumber: String,
                address: String,
                city: String,
                zipcode: Number,
                country: {
                    type: String,
                    default: "France",
                },
            },
        },
    ]
});

const MongoAppHistory = mongoose.model('AppHistory', appHistorySchema);

module.exports = MongoAppHistory;