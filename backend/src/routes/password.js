const express = require("express");
const userController = require("../controllers/userController");
const checkRole = require("../middlewares/password/checkRole");

const passwordRouter = express.Router();

passwordRouter.post("/password/", checkRole(),userController.passwordResetRequest);
passwordRouter.patch('/password/', checkRole(), userController.updateByEmail);
passwordRouter.get('/password/:token', checkRole(), userController.verifyResetToken);

module.exports = passwordRouter;