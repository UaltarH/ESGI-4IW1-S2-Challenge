const MongoOrder = require('../../mongo/models/MongoOrder');

const afterCreateHook = async (order, options) => {
    const user = await order.getUser();
    await MongoOrder.create({
        postgresId: order.id,
        orderNumber: order.orderNumber,
        date: order.date,
        user: {
            userId: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
        },
    });
};



module.exports = {
    afterCreateHook,
};