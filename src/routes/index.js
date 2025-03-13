import { Router } from "express";
import { authRouter } from './v1/auth.routes.js';
import { userRouter } from "./v1/user.routes.js";

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/users', userRouter);

export { routes };
