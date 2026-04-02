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
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                throw new AppError('Identifier (email or mobile) and password are required', 400);
            }

            const result = await this.authService.authenticate(identifier, password);

            res.status(200).json({
                status: 'success',
                ...result,
            });
        } catch (err) {
            next(err);
        }
    }
}
