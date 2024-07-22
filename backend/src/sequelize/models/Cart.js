const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, {
                foreignKey: {
                    name: 'UserId',
                    allowNull: true,
                },
            });
            Cart.hasMany(models.Cart_item);
        }
    }

    Cart.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Cart',
            timestamps: true,
        }
    );

    return Cart;
};
