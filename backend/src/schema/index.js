const userUpdateByUserSchema = require( "./user/updateByUser.schema");
const userUpdateByAdminSchema = require("./user/updateByAdmin.schema");
const userRegisterByUserSchema = require("./user/registerByUser.schema");
const userRegisterByAdminSchema = require("./user/updateByAdmin.schema");
const productModifySchema = require("./product.modifySchema");
const updateCartUserSchema = require("./cart/updateCartUser.schema.js");
const updateCartByUserSchema = require("./cart/updateCartByUser.schema.js");
const updateCartByGuestSchema = require("./cart/updateCartByGuest.schema.js");
const createCartByUserSchema = require("./cart/createCartByUser.schema.js");
const createCartByGuestSchema = require("./cart/createCartByGuest.schema.js");
const dashboardConfigSchema = require("./dashboard/dashboard.schema.js");

module.exports = {
    userUpdateByUserSchema,
    userUpdateByAdminSchema,
    userRegisterByUserSchema,
    userRegisterByAdminSchema,
    productModifySchema,
    updateCartUserSchema,
    updateCartByUserSchema,
    updateCartByGuestSchema,
    createCartByUserSchema,
    createCartByGuestSchema,
    dashboardConfigSchema,
};