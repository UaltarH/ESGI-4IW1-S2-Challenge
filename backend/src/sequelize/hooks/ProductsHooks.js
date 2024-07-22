const MongoProduct = require('../../mongo/models/MongoProduct');
const { createNotification } = require('../../services/notificationService');

const afterCreateHook = (models) => async (product, options) => {
    console.log('afterCreateHook', options);

    const category = await product.getCategory();
    await MongoProduct.create({
        postgresId: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        imagePath: product.imagePath,
        threshold: product.threshold,
        description: product.description,
        categoryId: product.CategoryId,
        categoryName: category.name,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    });

    // Créer une notification pour les utilisateurs qui ont la préférence newProduct
    await createNotification('user', 'newProduct', product, () => models);
};

const afterUpdateHook = (models) => async (product, options) => {
    const category = await product.getCategory();
    const oldProduct = await MongoProduct.findOne({ postgresId: product.id });

    const mongoProduct = await MongoProduct.findOneAndUpdate(
        { postgresId: product.id },
        {
            postgresId: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            imagePath: product.imagePath,
            threshold: product.threshold,
            description: product.description,
            categoryId: product.CategoryId,
            categoryName: category.name,
            updatedAt: product.updatedAt,
        }
    );

    if (!mongoProduct) {
        console.error(`MongoProduct with postgresId ${product.id} not found`);
        return;
    }

    console.log(`MongoProduct updated: ${mongoProduct}`);

    // notifications
    if (oldProduct.stock === 0 && product.stock > 0) {
        await createNotification('user', 'restockProduct', product, () => models);
    }
    if (oldProduct.price !== product.price) {
        await createNotification('user', 'priceChange', product, () => models);
    }

    if (product.stock <= 0) {
        await createNotification('admin', 'noStock', product, () => models);
    }
    if (product.stock > 0 && product.stock <= product.threshold) {
        await createNotification('admin', 'lowStock', product, () => models);
    }
};

const afterDestroyHook = async (product, options) => {
    const mongoProduct = await MongoProduct.findOneAndDelete({ postgresId: product.id });

    if (!mongoProduct) {
        console.error(`MongoProduct with postgresId ${product.id} not found`);
        return;
    }

    console.log(`MongoProduct deleted: ${mongoProduct}`);
};

module.exports = {
    afterCreateHook,
    afterUpdateHook,
    afterDestroyHook,
};
