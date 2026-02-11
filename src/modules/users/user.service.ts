import { UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class UserService {
    async create(data: any, tenantId: string) {
        const existing = await prisma.user.findFirst({
            where: { email: data.email, tenantId },
        });

        if (existing) {
            throw new AppError('Email already in use for this tenant', 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                tenantId,
                status: UserStatus.ACTIVE,
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findAll(tenantId: string) {
        return prisma.user.findMany({
            where: { tenantId },
            select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
                role: true,
                status: true,
                avatar: true,
                createdAt: true,
            },
        });
    }

    async findById(id: string, tenantId: string) {
        const user = await prisma.user.findFirst({
            where: { id, tenantId },
        });

        if (!user) {
            throw new AppError('User not found', 404);
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async update(id: string, data: any, tenantId: string) {
        const user = await this.findById(id, tenantId);

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    async delete(id: string, tenantId: string) {
        await this.findById(id, tenantId); // Check existence
        return prisma.user.delete({ where: { id } });
    }
}
