const MongoOrder = require('../../mongo/models/MongoOrder');

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

exports.afterUpdateHook = afterUpdateHook;