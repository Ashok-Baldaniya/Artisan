import { Router } from "express";
import { authRouter } from './v1/auth.routes.js';

const routes = Router();

routes.use('/auth', authRouter);

export { routes };
