import { Router } from "express";
import { userRouter } from './v1/auth.routes.js';

const routes = Router();

routes.route('/customer', userRouter);

export { routes };