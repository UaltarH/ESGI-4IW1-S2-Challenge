const { Model, DataTypes } = require('sequelize');
const { afterCreateHook } = require('../hooks/Order_statusHooks');

module.exports = function (sequelize, DataTypes) {
    class Order_status extends Model {
        static associate(models) {
            Order_status.belongsTo(models.Order);
        }
    }
    Order_status.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM('En attente', 'Confirmée', 'Expédiée', 'Livrée', 'Annulée', 'Remboursée'),
                allowNull: false,
            },
        },
        {
            sequelize: sequelize,
            modelName: 'Order_status',
            timestamps: true,
        }
    );
    Order_status.afterCreate(afterCreateHook);

    return Order_status;
}