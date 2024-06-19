const { Model, DataTypes } = require('sequelize');

module.exports = function (connection) {
    class Shipping extends Model { }
    Shipping.init({
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
        shippingMethod: {
            type: DataTypes.ENUM('standard', 'express'),
            allowNull: false,
        },
        trackingNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },        
    }, 
    {
        sequelize: connection,
        modelName: 'Shipping',
    })
}