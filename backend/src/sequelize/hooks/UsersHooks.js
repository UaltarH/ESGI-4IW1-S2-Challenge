const MongoOrder = require('../../mongo/models/MongoOrder');
const MongoAppHistory = require('../../mongo/models/MongoAppHistory');

const afterUpdateHook = async (user, options) => {
    const mongoOrder = await MongoOrder.findOneAndUpdate(
        { 'user.userId': user.id },
        {
            $set: {
                'user.firstname': user.firstname,
                'user.lastname': user.lastname,
                'user.email': user.email,
                'user.phone': user.phone,
            },
        },
    );

    if (!mongoOrder) {
        console.error(`MongoOrder with userId ${user.id} not found`);
        return;
    }

    console.log(`MongoOrder updated: ${mongoOrder}`);
};

const afterDeleteHook = async (user, options) => {
    const mongoOrders = await MongoOrder.find({ 'user.userId': user.id });
    let mongoOrdersMapped = [];
    if (!mongoOrders) {
        console.error(`MongoOrders with userId ${user.id} not found`);
    }
    mongoOrdersMapped = mongoOrders.map((mongoOrder) => {
        return {
            orderId: mongoOrder.postgresId,
            date: mongoOrder.date,
            status: mongoOrder.status,
            orderItems: mongoOrder.orderItems,
            payment: mongoOrder.payment,
            shipping: mongoOrder.shipping,
        };
    });
    const userMapped = {
        userId: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        zipcode: user.zipcode,
        country: user.country,
        birthdate: user.birthdate,
        role: user.role,
    };

    await MongoAppHistory.create({
        date: new Date(),
        userDeleted: userMapped,
        ordersDeleted: mongoOrdersMapped,
    });

    await MongoOrder.deleteMany({ 'user.userId': user.id });
};

module.exports = {
    afterUpdateHook,
    afterDeleteHook,
};