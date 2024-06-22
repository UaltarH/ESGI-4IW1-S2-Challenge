const { Router } = require("express");
const validate = require("../middlewares/validate.js");
const registerSchema = require("../schema/register.js");
const userController = require("../controllers/userController.js");

const userRouter = Router();

userRouter.get("/users", userController.getUsers);
userRouter.get("/users/:id", userController.getUser);
userRouter.post("/register", validate(registerSchema), userController.register);
userRouter.delete("/users/:id", userController.deleteUser);
userRouter.put("/users/:id", userController.put);
userRouter.patch("/users/:id", userController.patch);

module.exports = userRouter;
