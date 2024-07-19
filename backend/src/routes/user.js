const { Router } = require("express");
const checkRole = require("../middlewares/user/checkRole.js");
const userController = require("../controllers/userController.js");

const userRouter = Router();

userRouter.get("/users", checkRole(), userController.getUsers);
userRouter.get("/users/:id", checkRole(), userController.getUser);
userRouter.delete("/users/:id", userController.deleteUser);
userRouter.delete("/users/", userController.deleteMultiplesUsers);
userRouter.put("/users/:id", checkRole(), userController.replaceUser);
userRouter.patch("/users/:id", checkRole(), userController.modifyUsers);
userRouter.post("/users", checkRole(), userController.register);

module.exports = userRouter;
