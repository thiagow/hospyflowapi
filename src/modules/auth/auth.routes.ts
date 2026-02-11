import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const authRouter = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post('/login', authController.login.bind(authController));

export default authRouter;
