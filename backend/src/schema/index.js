const userModifyUserSchema = require( "./user.modifyUserSchema");
const userModifyAdminSchema = require("./user.modifyAdminSchema");
const userRegisterUserSchema = require("./user.registerUserSchema");
const userRegisterAdminSchema = require("./user.registerAdminSchema");
const productModifySchema = require("./product.modifySchema");

module.exports = {
    userModifyUserSchema,
    userModifyAdminSchema,
    userRegisterUserSchema,
    userRegisterAdminSchema,
    productModifySchema,
};