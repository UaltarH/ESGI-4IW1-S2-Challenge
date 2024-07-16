const { Router } = require("express");
const checkRole = require("../middlewares/checkRole.js");
const userController = require("../controllers/userController.js");

const userRouter = Router();

userRouter.get("/users", userController.getUsers);
userRouter.get("/users/:id", userController.getUser);
userRouter.delete("/users/:id", userController.deleteUser);
userRouter.delete("/users/", userController.deleteMultiplesUsers);
userRouter.put("/users/:id", checkRole(), userController.replaceUser);
userRouter.patch("/users/:id", checkRole(), userController.modifyUsers);
userRouter.post("/users", checkRole(), userController.register);

module.exports = userRouter;
