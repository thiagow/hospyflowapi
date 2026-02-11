import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types'; // Adjust path if needed
import { AppError } from '../shared/errors';

export const roleGuard = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Unauthorized', 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError('Forbidden: Insufficient permissions', 403));
        }

        next();
    };
};
