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

        // Ensure roomId exists if provided
        if (taskData.roomId) {
            const room = await prisma.room.findUnique({ where: { id: taskData.roomId } });
            if (!room) throw new AppError('Room not found', 404);
        }

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
        const task = await this.findById(id, tenantId);
        const { templateId, ...taskData } = data;

        // If status changes to COMPLETED, set completedAt
        if (taskData.status === 'COMPLETED' && task.status !== 'COMPLETED') {
            taskData.completedAt = new Date();

            // If this task is linked to a guest request, complete that too
            if (task.requestId) {
                await prisma.guestRequest.update({
                    where: { id: task.requestId },
                    data: {
                        status: 'COMPLETED',
                        resolvedAt: new Date()
                    }
                });
            }
        }

        // Handle template change
        if (templateId) {
            const template = await prisma.checklistTemplate.findUnique({
                where: { id: templateId },
                include: { items: true },
            });

            if (template) {
                // Delete existing items
                await prisma.taskChecklistItem.deleteMany({
                    where: { taskId: id },
                });

                // Create new items from template
                const newItems = template.items.map((item) => ({
                    text: item.text,
                    subtext: item.subtext,
                    order: item.order,
                    checked: false,
                }));

                taskData.checklistItems = {
                    create: newItems,
                };
            }
        }

        return prisma.task.update({
            where: { id },
            data: taskData,
            include: { checklistItems: { orderBy: { order: 'asc' } }, photos: true },
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
