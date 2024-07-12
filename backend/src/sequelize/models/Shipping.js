const { Model, DataTypes } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    class Shipping extends Model {
        static associate(models) {
            Shipping.belongsTo(models.Order);
        }
    }
    Shipping.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("En attente d'expédition", 'En livraison', 'En attente', 'Problème de livraison'),
                allowNull: false,
                defaultValue: 'En attente',
            },
            shippingMethod: {
                type: DataTypes.ENUM('standard', 'express'),
                allowNull: false,
            },
            trackingNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            zipcode: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            country: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'France',
            },
        },
        {
            sequelize: sequelize,
            modelName: 'Shipping',
            timestamps: true,
        }
    );
    return Shipping;
}