const userUpdateByUserSchema = require( "./user/updateByUser.schema");
const userUpdateByAdminSchema = require("./user/updateByAdmin.schema");
const userRegisterByUserSchema = require("./user/registerByUser.schema");
const userRegisterByAdminSchema = require("./user/updateByAdmin.schema");
const productModifySchema = require("./product.modifySchema");
const cartSchema = require("./cart/schema.js");

module.exports = {
    userUpdateByUserSchema,
    userUpdateByAdminSchema,
    userRegisterByUserSchema,
    userRegisterByAdminSchema,
    productModifySchema,
    cartSchema,
};