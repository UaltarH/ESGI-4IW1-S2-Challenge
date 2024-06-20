const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart_item extends Model { }

    Cart_item.init(
        {
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
                    model: 'Carts',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            productId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: 'Products',
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
            sequelize,
            modelName: 'Cart_item',
            timestamps: true,
        }
    );

    return Cart_item;
};
