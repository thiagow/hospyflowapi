import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '@prisma/client';
import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';
import { jwtConfig } from '../../config/jwt';

export class AuthService {
    async authenticate(identifier: string, password: string) {
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { mobile: identifier },
                    { whatsapp: identifier }
                ]
            },
        });

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        if (!jwtConfig.secret) {
            throw new Error('JWT_SECRET missing');
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn as any }
        );

        const { password: _, ...userWithoutPassword } = user;

        return { token, user: userWithoutPassword };
    }
}
