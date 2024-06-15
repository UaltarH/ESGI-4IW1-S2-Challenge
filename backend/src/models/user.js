import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";
export default class User extends Model { }

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            // allowNull defaults to true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "User", // We need to choose the model name
    }
);

