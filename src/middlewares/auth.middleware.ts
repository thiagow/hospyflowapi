import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { AuthenticatedRequest, AuthenticatedUser } from '../types';
import { AppError } from '../shared/errors';

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token not provided', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, jwtConfig.secret) as AuthenticatedUser;
        req.user = decoded;
        return next();
    } catch (err) {
        throw new AppError('Invalid token', 401);
    }
};
