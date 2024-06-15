import {Router} from "express";
import HelloController from "../controllers/helloController.js";
import authController from "../controllers/authController.js";
import cors from "cors";

// export const corsOptions = {
//     origin: "http://localhost:5173",
//     optionsSuccessStatus: 200,
// }
// indexRouter.get("/exempleCustomCors", cors(corsOptions), HelloController.index); // exemple : si vous voulez utiliser des CORS custom pour une route spécifique

export const indexRouter = Router();
indexRouter.get("/", HelloController.index);
indexRouter.get("/exempleCustomCors", cors(corsOptions), HelloController.index); // exemple : si vous voulez utiliser des CORS custom pour une route spécifique

/**
 * route "/user"
 * @type {Express}
 */
export const userRouter = Router();
userRouter.get("/all", SecurityController.getUsers);
userRouter.get("/byId/:id", SecurityController.getUser);
userRouter.get("/roles", SecurityController.getRoles);
userRouter.delete("/delete/:id", SecurityController.deleteUser);

/**
 * route "/auth"
 * @type {Express}
 */
export const authRouter = Router();
authRouter.post("/register", SecurityController.register);
indexRouter.get("/register", authController.register);
indexRouter.get("/login", authController.login);
