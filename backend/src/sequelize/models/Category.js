const { Model, DataTypes } = require('sequelize');

module.exports = function (connection) {
    class Category extends Model { }
    Category.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, 
    {
        sequelize: connection,
        modelName: 'Category',
    });
};