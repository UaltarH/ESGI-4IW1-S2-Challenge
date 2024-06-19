const { Model, DataTypes } = require('sequelize');

module.exports = function (connection) {
    class Order extends Model { }
    Order.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
            onUpdate: 'CASCADE', 
            onDelete: 'CASCADE',
        }, 
    },
    {
        sequelize: connection,
        modelName: 'Order',
        paranoid: true,
    });
}