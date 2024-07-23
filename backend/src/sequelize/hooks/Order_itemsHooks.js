const MongoOrder = require('../../mongo/models/MongoOrder');

const afterCreateHook = async (order_item, options) => {
    const product = await order_item.getProduct();
    const mongoOrder = await MongoOrder.findOneAndUpdate(
        { postgresId: order_item.OrderId },
        {
            $push: {
                orderItems: {
                    orderItemId: order_item.id,
                    productId: product.id,
                    productName: product.name,
                    price: order_item.price,
                    quantity: order_item.quantity,
                },
            },
        }
    );

    if (!mongoOrder) {
        console.error(`MongoOrder with postgresId ${order_item.OrderId} not found`);
        return;
    }
};



module.exports = {
    afterCreateHook,
};