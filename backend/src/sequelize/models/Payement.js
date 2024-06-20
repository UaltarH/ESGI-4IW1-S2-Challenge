const { Model, DataTypes } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    class Payment extends Model { }
    Payment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            orderId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Order',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            paymentMethod: {
                type: DataTypes.ENUM('credit_card', 'paypal'),
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
    return Payment;
}