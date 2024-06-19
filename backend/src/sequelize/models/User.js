const { Model, DataTypes } = require('sequelize');

module.exports = function (connection) {
    class User extends Model { }
    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        firstname: {
            type: DataTypes.STRING,    
            allowNull: false,        
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,         
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,            
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,            
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postal_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'user', 'store_manager', 'accountant'),
            defaultValue: 'user',
            allowNull: false,
        }
    }, {
        sequelize: connection,
        modelName: 'User',
        paranoid: true
    });
    return User;
}
