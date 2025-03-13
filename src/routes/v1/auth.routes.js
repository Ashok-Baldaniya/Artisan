import { Router } from 'express';
import { loginUser, signupUser, verifyUserEmail, forgotPassword, resetPassword, confirmForgotPassword } from '../../controllers/auth.controller.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { userSignupSchema, userLoginSchema, userForgotPasswordSchema, userResetPasswordSchema, userConfirmForgotPasswordSchema } from '../../utils/validator/user.schema.js';
import { authenticate, authSellerOrUser } from '../../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/signup', validateRequest(userSignupSchema), signupUser);
authRouter.get('/verify-email', verifyUserEmail);
authRouter.post('/login', validateRequest(userLoginSchema), loginUser);
authRouter.post('/forgot-password', validateRequest(userForgotPasswordSchema), forgotPassword);
authRouter.post('/confirm-forgot-password', validateRequest(userConfirmForgotPasswordSchema), confirmForgotPassword);
authRouter.post('/reset-password', authenticate, validateRequest(userResetPasswordSchema), resetPassword);

export { authRouter };
