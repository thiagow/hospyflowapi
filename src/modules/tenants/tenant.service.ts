import { TenantStatus } from '@prisma/client';
import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class TenantService {
    async create(data: { name: string; subdomain: string; planId: string }) {
        const existing = await prisma.tenant.findUnique({
            where: { subdomain: data.subdomain },
        });

        if (existing) {
            throw new AppError('Subdomain already in use', 400);
        }

        // Check if plan exists (optional but good practice)
        const plan = await prisma.plan.findUnique({ where: { id: data.planId } });
        if (!plan) {
            throw new AppError('Plan not found', 404);
        }

        return prisma.tenant.create({
            data: {
                ...data,
                status: TenantStatus.ACTIVE,
            },
        });
    }

    async findAll() {
        return prisma.tenant.findMany({
            include: { plan: true },
        });
    }

    async findById(id: string) {
        const tenant = await prisma.tenant.findUnique({
            where: { id },
            include: { plan: true },
        });

        if (!tenant) {
            throw new AppError('Tenant not found', 404);
        }

        return tenant;
    }
}
