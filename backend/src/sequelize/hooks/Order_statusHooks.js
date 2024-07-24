const MongoOrder = require('../../mongo/models/MongoOrder');

const afterCreateHook = async (order_status, options) => {
    const mongoOrder = await MongoOrder.findOneAndUpdate(
        { postgresId: order_status.OrderId },
        {
            $push: {
                status: {
                    statusId: order_status.id,
                    status: order_status.status,
                    date: order_status.createdAt,
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