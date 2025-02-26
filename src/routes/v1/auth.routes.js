import { Router } from 'express';
import { loginUser, registerUser, verifyUserEmail, forgotPassword } from '../../controllers/auth.controller.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { userSignupSchema, userLoginSchema, userVerifyEmailSchema, userForgotPasswordSchema } from '../../utils/validator/user.schema.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', validateRequest(userSignupSchema), registerUser);
authRouter.post('/login', validateRequest(userLoginSchema), loginUser);
authRouter.post('/verify-email', authenticate, validateRequest(userVerifyEmailSchema), verifyUserEmail);
authRouter.post('/forgot-password', authenticate, validateRequest(userForgotPasswordSchema), forgotPassword);
// authRouter.post('/reset-password',);

export { authRouter };
