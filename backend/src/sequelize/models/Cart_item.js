const { Model, DataTypes } = require('sequelize');
const { afterCreateHook, afterDestroyHook } = require('../hooks/Cart_item.Hooks');

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
    Cart_item.addHook('afterCreate', afterCreateHook);
    Cart_item.afterDestroy('afterDestroy', afterDestroyHook);
    return Cart_item;
};
