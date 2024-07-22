const MongoNotification = require('../mongo/models/MongoNotification');
const {sendEmailWithTemplate} = require('./sendMail');

async function createNotification(role, type, product, getModels) {
    const { User, User_pref } = getModels();
    const messages = {
        user: {
            newProduct: `Nouveau produit disponible : ${product.name}`,
            restockProduct: `Le produit ${product.name} est de nouveau disponible`,
            priceChange: `Le prix du produit ${product.name} a changé`
        },
        admin: {
            noStock: `Alerte stock: le produit ${product.name} est en rupture de stock`,
            lowStock: `Alerte stock: le produit ${product.name} a un stock faible (${product.stock})`
        }
    };

    let users;
    if (role === 'user') {
        const userPrefs = await User_pref.findAll({
            where: { [type]: true },
            include: [{ model: User, attributes: ['id', 'role'] }]
        });
        users = userPrefs.map(pref => pref.User);
    } else {
        users = await User.findAll({ where: { role: 'admin' } });
    }

    for (const user of users) {
        await MongoNotification.create({
            userId: user.id,
            roleUser: role,
            typeNotification: type,
            message: messages[role][type],
            read: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    //send mail
    try {
        await sendEmailWithTemplate(
            users.map(user => user.email),
            "Notification",
            {
                alertMessage: messages[role][type],
                host: process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://boxtobe.mapa-server.org",
            },
            "/../template/productAlert.ejs");
    } catch (error) {
        console.error("Failed to send email controller", error);
    }
}

module.exports = { createNotification };