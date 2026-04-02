import { TenantStatus, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class TenantService {
    async create(data: {
        name: string;
        subdomain: string;
        planId: string;
        whatsapp?: string;
        cnpj?: string;
        adminUser: {
            name: string;
            email: string;
            password: string;
            mobile: string;
        }
    }) {
        const existing = await prisma.tenant.findUnique({
            where: { subdomain: data.subdomain },
        });

        if (existing) {
            throw new AppError('Subdomain already in use', 400);
        }

        // Check if plan exists
        const plan = await prisma.plan.findUnique({ where: { id: data.planId } });
        if (!plan) {
            throw new AppError('Plan not found', 404);
        }

        // Check if admin email is already in use (globally for this tenant structure, or just generally?)
        // The schema has @@unique([email, tenantId]), allowing same email in different tenants.
        // But for a new tenant, there are no users yet. 
        // However, we should check if this email is already a SAAS_ADMIN or something if we want global uniqueness?
        // strict unique constraint is only per tenant. So it's fine.

        const hashedPassword = await bcrypt.hash(data.adminUser.password, 10);

        return prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({
                data: {
                    name: data.name,
                    subdomain: data.subdomain,
                    planId: data.planId,
                    whatsapp: data.whatsapp,
                    cnpj: data.cnpj,
                    status: TenantStatus.ACTIVE,
                },
            });

            const user = await tx.user.create({
                data: {
                    name: data.adminUser.name,
                    email: data.adminUser.email,
                    mobile: data.adminUser.mobile,
                    password: hashedPassword,
                    role: UserRole.ADMIN,
                    status: UserStatus.ACTIVE,
                    tenantId: tenant.id,
                },
            });

            return { tenant, adminUser: { ...user, password: undefined } };
        });
    }

    async findAll() {
        return prisma.tenant.findMany({
            include: { plan: true },
        });
    }

    async update(id: string, data: Partial<{ name: string; whatsapp: string; cnpj: string; planId: string; status: TenantStatus }>) {
        const tenant = await prisma.tenant.update({
            where: { id },
            data,
        });
        return tenant;
    }

    async delete(id: string) {
        // Soft delete or hard delete? Since it has many relations, maybe just status update to INACTIVE
        return prisma.tenant.update({
            where: { id },
            data: { status: TenantStatus.INACTIVE }
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
