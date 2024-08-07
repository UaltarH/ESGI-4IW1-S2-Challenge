const MongoOrder = require('../../mongo/models/MongoOrder');

const afterCreateHook = async (payment, options) => {
    const mongoOrder = await MongoOrder.findOneAndUpdate(
        { postgresId: payment.OrderId },
        {
            $set: {
                payment: {
                    paymentId: payment.id,
                    stripeSessionId: payment.stripeSessionId,
                    amount: payment.amount,
                },
            },
        },
    );

    if (!mongoOrder) {
        console.error(`MongoOrder with postgresId ${payment.OrderId} not found`);
        return;
    }

};


module.exports = {
    afterCreateHook,
};