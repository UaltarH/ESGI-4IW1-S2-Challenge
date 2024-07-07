const { Router } = require("express");
const validate = require("../middlewares/validate.js");
const registerVerif = require("../middlewares/registerVerif.js");
const modifySchema = require("../schema/modifySchema.js");
const registerSchema = require("../schema/registerSchema.js");
const userController = require("../controllers/userController.js");

const userRouter = Router();

userRouter.get("/users", userController.getUsers);
userRouter.get("/users/:id", userController.getUser);
userRouter.delete("/users/:id", userController.deleteUser);
userRouter.put("/users/:id", validate(registerSchema), registerVerif(), userController.replaceUser);
userRouter.patch("/users/:id", validate(modifySchema), userController.modifyUsers);
userRouter.post("/register", validate(registerSchema), registerVerif(),userController.register);
    
module.exports = userRouter;
