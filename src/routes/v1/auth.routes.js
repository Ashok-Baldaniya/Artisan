import { Router } from 'express';
import { loginUser, signupUser, verifyUserEmail, forgotPassword, resetPassword } from '../../controllers/auth.controller.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { userSignupSchema, userLoginSchema, userForgotPasswordSchema, userResetPasswordSchema } from '../../utils/validator/user.schema.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/signup', validateRequest(userSignupSchema), signupUser);
authRouter.post('/login', validateRequest(userLoginSchema), loginUser);
authRouter.get('/verify-email', verifyUserEmail);
authRouter.post('/forgot-password', validateRequest(userForgotPasswordSchema), forgotPassword);
authRouter.post('/reset-password', authenticate, validateRequest(userResetPasswordSchema), resetPassword);

export { authRouter };
