const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User_pref extends Model {
        static associate(models) {
            User_pref.belongsTo(models.User);
        }
    }

    User_pref.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            newProduct: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            restockProduct: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            priceChange: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'User_pref',
            timestamps: true,
        }
    );

    return User_pref;
};