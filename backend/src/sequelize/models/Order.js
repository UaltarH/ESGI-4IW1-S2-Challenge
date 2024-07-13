const { Model, DataTypes } = require('sequelize');
const { afterCreateHook } = require('../hooks/OrdersHooks');

module.exports = function (sequelize, DataTypes) {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User);
            Order.hasMany(models.Order_item);
            Order.hasOne(models.Payment);
            Order.hasOne(models.Shipping);
        }
    }
    Order.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize: sequelize,
            modelName: 'Order',
            paranoid: true,
            timestamps: true,
        }
    );
    Order.afterCreate(afterCreateHook);

    return Order;
}