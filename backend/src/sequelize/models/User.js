const { Model, DataTypes } = require('sequelize');

module.exports = function (connection) {
    class User extends Model { }
    User.init({
        // Model attributes are defined here
        firstname: {
            type: DataTypes.STRING,
            validate: {
                len: [2, 50],
                is: /^[a-zA-Z]{2,50}$/i
            }
        },
        lastname: {
            type: DataTypes.STRING,
            validate: {
                len: [2, 50],
                is: /^[a-zA-Z]{2,50}$/i
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: [true, "L'email est obligatoire"],
                isEmail: [true, "Email invalide"],
                len: [5, 50],
                is: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
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
        },
        address: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
            validate: {
                len: [2, 50],
                is: /^[a-zA-Z]{2,50}$/i
            }
        },
        postal_code: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: [true, "Code postal invalide"],
                len: [5, 5]
            }
        },
        phone: {
            type: DataTypes.STRING,
        },
        dob: {
            type: DataTypes.DATEONLY,
            validate: {
                isDate: [true, "Date invalide"]
            }
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        }
    }, {
        // Other model options go here
        sequelize: connection, // We need to pass the connection instance
        modelName: 'User', // We need to choose the model name
        paranoid: true
    });
    return User;
}
