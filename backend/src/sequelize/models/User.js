const { Model, DataTypes } = require("sequelize");
const { afterUpdateHook, afterDeleteHook } = require("../hooks/UsersHooks");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { normalizeString } = require("../../services/cleanUtils");

module.exports = function (sequelize, DataTypes) {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order);
      User.hasOne(models.Cart);
      User.hasOne(models.User_pref);
    }

    static addHooks(models) {
      User.addHook("beforeCreate", async (user) => {
        user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
        user.verification_token = uuidv4();
        user.is_verified = false;
        user.email = normalizeString(user.email).toLowerCase();
      });
      User.addHook("beforeUpdate", async (user, { fields }) => {
        if (fields.includes("password")) user.password = await bcrypt.hash(user.password, await bcrypt.genSalt());
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
      zipcode: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "France",
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "user", "store_manager", "accountant"),
        defaultValue: "user",
        allowNull: false,
      },
      verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      sequelize: sequelize,
      modelName: "User",
      timestamps: true,
    }
  );

  User.addHooks();
  User.afterUpdate(afterUpdateHook);
  User.afterDestroy(afterDeleteHook);

  return User;
};
