const { Model, DataTypes } = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Order);
            User.hasOne(models.Cart);
        }

        static addHooks() {
            User.addHook('beforeCreate', async (user) => {
                user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
            });
            User.addHook('beforeUpdate', async (user, { fields }) => {
                if (fields.includes('password')) {
                    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
                }
            });
        }
    }
    User.init(
        {
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
        },
        {
            sequelize: sequelize,
            modelName: 'User',
            paranoid: true,
            timestamps: true,
        }
    );
    return User;
}
