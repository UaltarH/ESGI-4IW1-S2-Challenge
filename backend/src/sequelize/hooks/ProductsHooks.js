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
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
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
            updatedAt: product.updatedAt,
        }
    );

    if (!mongoProduct) {
        console.error(`MongoProduct with postgresId ${product.id} not found`);
        return;
    }

    console.log(`MongoProduct updated: ${mongoProduct}`);
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
