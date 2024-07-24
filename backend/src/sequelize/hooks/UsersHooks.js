const MongoOrder = require('../../mongo/models/MongoOrder');
const MongoAppHistory = require('../../mongo/models/MongoAppHistory');

const anonymizeValue = (prefix) => {
    return `${prefix}-${Math.random().toString(36).substring(2, 10)}`;
};

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
};

const afterDeleteHook = async (user, options) => {
    try {
        const mongoOrders = await MongoOrder.find({ 'user.userId': user.id });

        if (mongoOrders.length === 0) {
            console.log(`Aucune commande trouvée pour l'utilisateur ${user.id}`);
        } else {
            const anonymizedUserInfo = {
                userId: anonymizeValue('user'),
                firstname: 'Anonymous',
                lastname: 'Anonymous',
                email: anonymizeValue('email@example.com'),
                phone: anonymizeValue('phone'),
            };

            const updatePromises = mongoOrders.map(order =>
                MongoOrder.updateOne(
                    { _id: order._id },
                    { $set: { user: anonymizedUserInfo } }
                )
            );

            await Promise.all(updatePromises);

            console.log(`${updatePromises.length} commandes anonymisées pour l'utilisateur ${user.id}`);
        }

        const userMapped = {
            userId: anonymizeValue('user'),
            firstname: 'Anonymous',
            lastname: 'Anonymous',
            email: anonymizeValue('email@example.com'),
            phone: anonymizeValue('phone'),
            address: 'Anonymous Address',
            city: 'Anonymous City',
            zipcode: 11111,
            country: 'Anonymous Country',
            birthdate: new Date(),
            role: user.role,
        };

        const ordersMapped = mongoOrders.map(order => ({
            orderId: order.postgresId,
            orderNumber: order.orderNumber,
            date: order.date,
            status: order.status,
            orderItems: order.orderItems,
            payment: order.payment,
            shipping: order.shipping,
        }));

        await MongoAppHistory.create({
            date: new Date(),
            userDeleted: userMapped,
            ordersAnonymized: ordersMapped,
        });

    } catch (error) {
        console.error("Erreur lors de l'anonymisation des commandes:", error);
    }
};

module.exports = {
    afterUpdateHook,
    afterDeleteHook,
};