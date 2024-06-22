const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart_item extends Model {
        static associate(models) {
            Cart_item.belongsTo(models.Cart);
            Cart_item.belongsTo(models.Product);
        }
    }

    Cart_item.init(
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
        },
        {
            sequelize,
            modelName: 'Cart_item',
            timestamps: true,
        }
    );

    return Cart_item;
};
