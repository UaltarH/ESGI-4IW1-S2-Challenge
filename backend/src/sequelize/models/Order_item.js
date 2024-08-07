const { Model, DataTypes } = require('sequelize');
const { afterCreateHook } = require('../hooks/Order_itemsHooks');

module.exports = (sequelize, DataTypes) => {
    class Order_item extends Model {
        static associate(models) {
            Order_item.belongsTo(models.Order);
            Order_item.belongsTo(models.Product);
        }
    }

    Order_item.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Order_item',
            timestamps: true,
        }
    );
    Order_item.afterCreate(afterCreateHook);

    return Order_item;
};
