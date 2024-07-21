const { Router } = require("express");
const checkRole = require("../middlewares/user/checkRole.js");
const userController = require("../controllers/userController.js");

const userRouter = Router();

userRouter.get("/users/:id", checkRole(), userController.getUser);
userRouter.patch("/users/:id", checkRole(), userController.modifyUsers);
userRouter.get("/users", checkRole(), userController.getUsers);
userRouter.delete("/users/:id", checkRole(), userController.deleteUser);
userRouter.delete("/users/", checkRole(), userController.deleteMultiplesUsers);

module.exports = userRouter;
