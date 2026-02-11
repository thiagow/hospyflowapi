import { TaskStatus } from '@prisma/client';
import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class TaskService {
    async create(data: any, tenantId: string) {
        const { templateId, checklistItems: inputItems, ...taskData } = data;

        let checklistItems = inputItems || [];

        if (templateId) {
            const template = await prisma.checklistTemplate.findUnique({
                where: { id: templateId },
                include: { items: true },
            });

            if (template) {
                // Combine template items with input items if any, or just use template
                const templateItems = template.items.map((item) => ({
                    text: item.text,
                    subtext: item.subtext,
                    order: item.order,
                    checked: false,
                }));
                checklistItems = [...checklistItems, ...templateItems];
            }
        }

        // Ensure roomId exists
        const room = await prisma.room.findUnique({ where: { id: taskData.roomId } });
        if (!room) throw new AppError('Room not found', 404);

        return prisma.task.create({
            data: {
                ...taskData,
                tenantId,
                checklistItems: {
                    create: checklistItems,
                },
            },
            include: {
                checklistItems: { orderBy: { order: 'asc' } },
                photos: true,
            },
        });
    }

    async findAll(tenantId: string, filter?: { assignedToId?: string; roomId?: string; status?: TaskStatus }) {
        return prisma.task.findMany({
            where: {
                tenantId,
                ...filter,
            },
            include: {
                room: { include: { type: true } },
                assignedTo: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findById(id: string, tenantId: string) {
        const task = await prisma.task.findFirst({
            where: { id, tenantId },
            include: {
                checklistItems: { orderBy: { order: 'asc' } },
                photos: true,
                room: true,
                assignedTo: { select: { id: true, name: true } },
            },
        });

        if (!task) throw new AppError('Task not found', 404);

        return task;
    }

    async update(id: string, data: any, tenantId: string) {
        await this.findById(id, tenantId);

        // If status changes to COMPLETED, set completedAt
        if (data.status === 'COMPLETED') {
            data.completedAt = new Date();
        }

        return prisma.task.update({
            where: { id },
            data,
            include: { checklistItems: true, photos: true },
        });
    }

    async delete(id: string, tenantId: string) {
        await this.findById(id, tenantId);
        return prisma.task.delete({ where: { id } });
    }

    async toggleChecklistItem(itemId: string, checked: boolean, tenantId: string) {
        // Verify item belongs to a task in tenant
        const item = await prisma.taskChecklistItem.findUnique({
            where: { id: itemId },
            include: { task: true },
        });

        if (!item || item.task.tenantId !== tenantId) {
            throw new AppError('Item not found', 404);
        }

        return prisma.taskChecklistItem.update({
            where: { id: itemId },
            data: { checked },
        });
    }
}
