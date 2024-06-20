const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model { }

    Category.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Category',
            timestamps: true,
        }
    );

    return Category;
};
