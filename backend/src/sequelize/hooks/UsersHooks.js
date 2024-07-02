const MongoUser = require('../../mongo/models/MongoUser');

const afterCreateHook = async (user, options) => {
    await MongoUser.create({
        postgresId: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        address: user.address,
        city: user.city,
        zipcode: user.zipcode,
        country: user.country,
        phone: user.phone,
        birthdate: user.birthdate,
        role: user.role,
        deleteAt: null,
    });
};

const afterUpdateHook = async (user, options) => {
    const mongoUser = await MongoUser.findOneAndUpdate(
        { postgresId: user.id },
        {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            address: user.address,
            city: user.city,
            zipcode: user.zipcode,
            country: user.country,
            phone: user.phone,
            birthdate: user.birthdate,
            role: user.role,
        }
    );

    if (!mongoUser) {
        console.error(`MongoUser with postgresId ${user.id} not found`);
        return;
    }

    console.log(`MongoUser updated: ${mongoUser}`);
};

const afterDestroyHook = async (user, options) => {
    const mongoUser = await MongoUser.findOneAndUpdate(
        { postgresId: user.id },
        { deleteAt: new Date() }
    );

    if (!mongoUser) {
        console.error(`MongoUser with postgresId ${user.id} not found`);
        return;
    }

    console.log(`MongoUser deleted (deleteAt): ${mongoUser}`);
};

module.exports = {
    afterCreateHook,
    afterUpdateHook,
    afterDestroyHook,
};
