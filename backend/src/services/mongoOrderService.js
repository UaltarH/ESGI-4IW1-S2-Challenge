const MongoOrder = require('../mongo/models/MongoOrder');
const { User, Product } = require('../sequelize/models');

async function createMongoOrder(order, userId, orderItemsRes, paymentRes, shippingRes, orderStatusRes) {
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

        const orderStatusFinal = orderStatusRes.map(orderStatus => ({
            statusId: orderStatus.id,
            status: orderStatus.status,
            date: orderStatus.createdAt,
        }));

        await MongoOrder.create({
            postgresId: order.id,
            orderNumber: order.orderNumber,
            date: order.date,
            user: {
                userId: order.UserId,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
            },
            status: orderStatusFinal,
            orderItems: orderItemsFinal,
            payment: {
                paymentId: paymentRes.id,
                stripeSessionId: paymentRes.stripeSessionId,
                amount: paymentRes.amount,
            },
            shipping: {
                shippingId: shippingRes.id,
                status: shippingRes.status,
                shippingMethod: shippingRes.shippingMethod,
                trackingNumber: shippingRes.trackingNumber,
                address: shippingRes.address,
                city: shippingRes.city,
                zipcode: shippingRes.zipcode,
                country: shippingRes.country,
            },
        });

        console.log('Order created in MongoDB');
    } catch (error) {
        console.error('Error creating order in MongoDB:', error);
        throw error;
    }
}

module.exports = { createMongoOrder };
