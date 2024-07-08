const { Router } = require("express");
const validate = require("../middlewares/validate.js");
const addRoleUser = require("../middlewares/addRoleUser.js");
const modifySchema = require("../schema/modifySchema.js");
const registerSchema = require("../schema/registerSchema.js");
const userController = require("../controllers/userController.js");

const userRouter = Router();

userRouter.get("/users", userController.getUsers);
userRouter.get("/users/:id", userController.getUser);
userRouter.delete("/users/:id", userController.deleteUser);
userRouter.put("/users/:id", validate(registerSchema), addRoleUser(), userController.replaceUser);
userRouter.patch("/users/:id", validate(modifySchema), userController.modifyUsers);
userRouter.post("/register", validate(registerSchema), addRoleUser(),userController.register);
    
module.exports = userRouter;
