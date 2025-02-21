import { Router } from 'express';
import { loginUser, registerUser, verifyUserEmail, forgotPassword } from '../../controllers/customer.controller.js';

const userRouter = Router();

userRouter.post('/auth/register', registerUser);
userRouter.post('/auth/login', loginUser);
userRouter.post('/auth/verify-email', verifyUserEmail);
userRouter.post('/auth/forgot-password', forgotPassword);
userRouter.post('/auth/reset-password',);

export { userRouter };
