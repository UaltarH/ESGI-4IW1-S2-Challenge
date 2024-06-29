const express = require("express");
const HelloController = require("../controllers/helloController.js");
const {SecurityController} = require("../controllers/securityControllers");
// const {register, login} = require("../controllers/authController");
// const authController = require("../controllers/authController.js");

const indexRouter = express.Router();
indexRouter.get("/", HelloController.index);


const authRouter = express.Router();
// authRouter.get("/register", register);
// authRouter.get("/login", login);

const mockRouter = express.Router();
// TODO : supprimer /register, on doit utiliser la même route que pour get un user. Mais on fait un create
mockRouter.get("/users", SecurityController.getUsers);
mockRouter.get("/users/:id", SecurityController.getUser);
mockRouter.post("/users", SecurityController.mockCreate);
mockRouter.get("/roles", SecurityController.mockGetRoles);

module.exports = {
  indexRouter,
  authRouter,
  mockRouter
};
