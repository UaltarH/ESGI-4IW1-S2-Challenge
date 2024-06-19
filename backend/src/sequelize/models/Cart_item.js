const { Model, DataTypes } = require('sequelize');

module.exports = function (connection) {
    class Cart_item extends Model { }
    Cart_item.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        cartId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Cart',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        productId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Product',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, 
    {
        sequelize: connection,
        modelName: 'Cart_item',
    });
};