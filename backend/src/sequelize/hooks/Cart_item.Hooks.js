const MongoProduct = require('../../mongo/models/MongoProduct');
const crudService = require('../../services/crudGeneric');

const afterCreateHook = async (cartItem, options) => {
    const mongoProduct = await MongoProduct.findOneAndUpdate(
        { postgresId: cartItem.ProductId },
        {
            $inc: { stock: -cartItem.quantity },
        }
    );
    if (!mongoProduct) {
        console.error(`MongoProduct with postgresId ${cartItem.ProductId} not found`);
        return;
    }
    console.log(`MongoProduct updated: ${mongoProduct}`);
}
const afterDestroyHook = async (cartItem, options) => {
    const mongoProduct = await MongoProduct.findOneAndUpdate(
        { postgresId: cartItem.ProductId },
        {
            $inc: { stock: cartItem.quantity },
        }
    );
    if (!mongoProduct) {
        console.error(`MongoProduct with postgresId ${cartItem.ProductId} not found`);
        return;
    }
    console.log(`MongoProduct updated: ${mongoProduct}`);
}
module.exports = {
    afterCreateHook,
    afterDestroyHook,
};
