const MongoProduct = require('../../mongo/models/MongoProduct');

const afterCreateHook = async (product, options) => {
    const category = await product.getCategory();
    await MongoProduct.create({
        postgresId: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        categoryId: product.CategoryId,
        categoryName: category.name,
        deleteAt: null,
    });
};

const afterUpdateHook = async (product, options) => {
    const mongoProduct = await MongoProduct.findOneAndUpdate(
        { postgresId: product.id },
        {
            postgresId: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            categoryId: product.CategoryId,
        }
    );

    if (!mongoProduct) {
        console.error(`MongoProduct with postgresId ${product.id} not found`);
        return;
    }

    console.log(`MongoProduct updated: ${mongoProduct}`);
};

const afterDestroyHook = async (product, options) => {
    const mongoProduct = await MongoProduct.findOneAndUpdate(
        { postgresId: product.id },
        { deleteAt: new Date() }
    );

    if (!mongoProduct) {
        console.error(`MongoProduct with postgresId ${product.id} not found`);
        return;
    }

    console.log(`MongoProduct deleted (deleteAt): ${mongoProduct}`);
};

module.exports = {
    afterCreateHook,
    afterUpdateHook,
    afterDestroyHook,
};
