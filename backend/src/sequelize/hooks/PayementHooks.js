const MongoOrder = require('../../mongo/models/MongoOrder');

const afterCreateHook = async (payment, options) => {
    const mongoOrder = await MongoOrder.findOneAndUpdate(
        { postgresId: payment.OrderId },
        {
            $set: {
                payment: {
                    paymentId: payment.id,
                    paymentMethod: payment.paymentMethod,
                    amount: payment.amount,
                },
            },
        },
    );

    if (!mongoOrder) {
        console.error(`MongoOrder with postgresId ${payment.OrderId} not found`);
        return;
    }

    console.log(`MongoOrder updated: ${mongoOrder}`);
};


module.exports = {
    afterCreateHook,
};