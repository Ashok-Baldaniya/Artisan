import { Router } from 'express';
import { loginUser, registerUser, verifyUserEmail, forgotPassword } from '../../controllers/auth.controller.js';
import { validateRequest } from '../../utils/validators.js';
import { userValidationSchema } from '../../utils/validator/user.schema.js';

const authRouter = Router();

authRouter.post('/register', validateRequest(userValidationSchema), registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/verify-email', verifyUserEmail);
authRouter.post('/forgot-password', forgotPassword);
// authRouter.post('/reset-password',);

export { authRouter };
