import Router from "express";
import {HelloController} from "../controllers/helloController.js";
import {SecurityController} from "../controllers/securityControllers.js";
import cors from "cors";

export const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
}

/**
 * route "/"
 * @type {Express}
 */
export const indexRouter = Router();
indexRouter.get("/", HelloController.index);
indexRouter.get("/exempleCustomCors", cors(corsOptions), HelloController.index); // exemple : si vous voulez utiliser des CORS custom pour une route spécifique

/**
 * route "/user"
 * @type {Express}
 */
export const userRouter = Router();
userRouter.get("/roles", SecurityController.getRoles);
