import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AppError } from '../../shared/errors';

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw new AppError('Email and password are required', 400);
            }

            const result = await this.authService.authenticate(email, password);

            res.status(200).json({
                status: 'success',
                ...result,
            });
        } catch (err) {
            next(err);
        }
    }
}
