import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class ChecklistTemplateService {
    async create(data: { name: string; tenantId: string; items: { text: string; subtext?: string; order: number }[] }) {
        const { name, tenantId, items } = data;

        return prisma.checklistTemplate.create({
            data: {
                name,
                tenantId,
                items: {
                    create: items,
                },
            },
            include: {
                items: true,
            },
        });
    }

    async findAll(tenantId: string) {
        return prisma.checklistTemplate.findMany({
            where: { tenantId },
            include: {
                items: {
                    orderBy: { order: 'asc' },
                },
            },
        });
    }

    async findById(id: string, tenantId: string) {
        const template = await prisma.checklistTemplate.findFirst({
            where: { id, tenantId },
            include: {
                items: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        if (!template) {
            throw new AppError('Template not found', 404);
        }

        return template;
    }

    async delete(id: string, tenantId: string) {
        await this.findById(id, tenantId);
        return prisma.checklistTemplate.delete({
            where: { id },
        });
    }
}
