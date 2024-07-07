const MongoOrder = require('../mongo/models/MongoOrder');
const { User, Product } = require('../sequelize/models');

async function createMongoOrder(order, userId, orderItemsRes, paymentRes, shippingRes) {
    try {
        let user = await User.findByPk(userId);

        const orderItemsFinal = await Promise.all(orderItemsRes.map(async orderItem => {
            let product = await Product.findByPk(orderItem.ProductId);
            return {
                orderItemId: orderItem.id,
                productId: orderItem.ProductId,
                productName: product.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
            };
        }));

        await MongoOrder.create({
            postgresId: order.id,
            date: order.date,
            user: {
                userId: order.UserId,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
            },
            orderItems: orderItemsFinal,
            payment: {
                paymentId: paymentRes.id,
                paymentMethod: paymentRes.paymentMethod,
                amount: paymentRes.amount,
            },
            shipping: {
                shippingId: shippingRes.id,
                shippingMethod: shippingRes.shippingMethod,
                trackingNumber: shippingRes.trackingNumber,
                address: shippingRes.address,
                city: shippingRes.city,
                zipcode: shippingRes.zipcode,
                country: shippingRes.country,
            },
            deleteAt: null,
        });

        console.log('Order created in MongoDB');
    } catch (error) {
        console.error('Error creating order in MongoDB:', error);
        throw error;
    }
}

module.exports = { createMongoOrder };