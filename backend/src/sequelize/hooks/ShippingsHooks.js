const MongoOrder = require('../../mongo/models/MongoOrder');

const afterCreateOrUpdateHook = async (shipping, options) => {
    const mongoOrder = await MongoOrder.findOneAndUpdate(
        { postgresId: shipping.OrderId },
        {
            $set: {
                shipping: {
                    shippingId: shipping.id,
                    shippingMethod: shipping.shippingMethod,
                    trackingNumber: shipping.trackingNumber,
                    address: shipping.address,
                    city: shipping.city,
                    zipcode: shipping.zipcode,
                    country: shipping.country,
                },
            },
        },
    );

    if (!mongoOrder) {
        console.error(`MongoOrder with postgresId ${shipping.OrderId} not found`);
        return;
    }
};


module.exports = {
    afterCreateOrUpdateHook,
};