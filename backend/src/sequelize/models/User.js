const {Model, DataTypes} = require('sequelize');
const connection = require('./db');

module.exports = function(sequelize) {
    class User extends Model {}
    User.init({
        // Model attributes are defined here
        firstname: {
            type: DataTypes.STRING,
        },
        lastname: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: [true, "L'email est obligatoire"],
                isEmail: [true, "Email invalide"]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: [true, "Le mot de passe est obligatoire"],
                len: [8, 50],
                is: /^[a-zA-Z0-9]{8,50}$/i
            }
        }
    }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'User', // We need to choose the model name
        paranoid: true
    });
    return User;
}
