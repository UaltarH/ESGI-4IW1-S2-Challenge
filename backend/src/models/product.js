import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.js";

export default class Product extends Model { }

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        length: {
            type: DataTypes.FLOAT,
            // allowNull defaults to true
        },
        width: {
            type: DataTypes.FLOAT,
            allowNull: false,
            unique: true
        },
        height: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: "Product", // We need to choose the model name
    }
);


