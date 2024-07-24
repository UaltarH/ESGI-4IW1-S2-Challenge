const userUpdateByUserSchema = require("./user/updateByUser.schema");
const userUpdateByAdminSchema = require("./user/updateByAdmin.schema");
const userRegisterByUserSchema = require("./user/registerByUser.schema");
const userRegisterByAdminSchema = require("./user/updateByAdmin.schema");
const productSchema = require("./product/createProduct.schema.js");
const updateCartUserSchema = require("./cart/updateCartUser.schema.js");
const updateCartByUserSchema = require("./cart/updateCartByUser.schema.js");
const updateCartByGuestSchema = require("./cart/updateCartByGuest.schema.js");
const createCartByUserSchema = require("./cart/createCartByUser.schema.js");
const createCartByGuestSchema = require("./cart/createCartByGuest.schema.js");
const dashboardConfigSchema = require("./dashboard/dashboard.schema.js");
const widgetValidationSchema = require("./dashboard/widget.schema.js");
const createProductSchema = require("./product/createProduct.schema.js");
const updateProductSchema = require("./product/updateProduct.schema.js");
const checkPasswordSchema = require("./user/checkPassword.schema.js");
const loginSchema = require("./user/login.schema.js");
const passwordResetRequest = require("./password/passwordResetRequest.schema.js");

module.exports = {
    userUpdateByUserSchema,
    userUpdateByAdminSchema,
    userRegisterByUserSchema,
    userRegisterByAdminSchema,
    productSchema,
    updateCartUserSchema,
    updateCartByUserSchema,
    updateCartByGuestSchema,
    createCartByUserSchema,
    createCartByGuestSchema,
    dashboardConfigSchema,
    widgetValidationSchema,
    createProductSchema,
    updateProductSchema,
    checkPasswordSchema,
    loginSchema,
    passwordResetRequest,
};