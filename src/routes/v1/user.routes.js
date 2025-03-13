import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { getCurrentUserProfile } from '../../controllers/user.controller';

const userRouter = Router();

userRouter.get('/profile', authenticate, getCurrentUserProfile);

export { userRouter };