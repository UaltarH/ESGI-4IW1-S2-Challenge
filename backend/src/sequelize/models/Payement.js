const { Model, DataTypes } = require('sequelize');
const { afterCreateHook } = require('../hooks/PayementHooks');

module.exports = function (sequelize, DataTypes) {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.Order);
        }
    }
    Payment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            stripeSessionId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize: sequelize,
            modelName: 'Payment',
            timestamps: true,
        }
    );
    Payment.afterCreate(afterCreateHook);

    return Payment;
}