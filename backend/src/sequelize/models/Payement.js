const { Model, DataTypes } = require('sequelize');

module.exports = function (connection) {
    class Payement extends Model { }
    Payement.init({
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
        payementMethod: {
            type: DataTypes.ENUM('credit_card', 'paypal'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, 
    {
        sequelize: connection,
        modelName: 'Payement',
    });
}