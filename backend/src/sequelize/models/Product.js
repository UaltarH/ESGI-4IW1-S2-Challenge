const { Model, DataTypes } = require('sequelize');
const { afterCreateHook, afterUpdateHook, afterDestroyHook } = require('../hooks/ProductsHooks');


module.exports = function (sequelize, DataTypes) {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category);
            Product.hasMany(models.Cart_item);
            Product.hasMany(models.Order_item);

            Product.afterCreate(afterCreateHook(models));
            Product.afterUpdate(afterUpdateHook(models));
            Product.afterDestroy(afterDestroyHook);
        }
    }
    Product.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            imagePath: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            threshold: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize: sequelize,
            modelName: 'Product',
            timestamps: true,
        }
    );



    return Product;
}