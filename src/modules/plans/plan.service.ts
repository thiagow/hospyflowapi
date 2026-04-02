import prisma from '../../shared/prisma';
import { Plan, Prisma } from '@prisma/client';

export class PlanService {
    async create(data: Prisma.PlanCreateInput): Promise<Plan> {
        return prisma.plan.create({ data });
    }

    async findAll(): Promise<Plan[]> {
        return prisma.plan.findMany({
            where: { isActive: true }
        });
    }

    async findById(id: string): Promise<Plan | null> {
        return prisma.plan.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.PlanUpdateInput): Promise<Plan> {
        return prisma.plan.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Plan> {
        // Soft delete
        return prisma.plan.update({
            where: { id },
            data: { isActive: false }
        });
    }
}
