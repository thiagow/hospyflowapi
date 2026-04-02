import { RequestStatus, RequestType } from '@prisma/client';
import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class RequestService {
    async create(data: any, tenantId: string) {
        // Find room by roomNumber to get roomId
        const room = await prisma.room.findUnique({
            where: { number_tenantId: { number: data.roomNumber, tenantId } }
        });

        if (!room) throw new AppError('Quarto não encontrado', 404);

        // Try to find an active guest in this room. If not found, fallback to the user who created it (e.g. Receptionist)
        let finalGuestId = data.guestId;
        const activeGuest = await prisma.user.findFirst({
            where: { roomId: room.id, role: 'GUEST', status: 'ACTIVE', tenantId }
        });
        
        if (activeGuest) {
            finalGuestId = activeGuest.id;
        }

        return prisma.guestRequest.create({
            data: {
                roomId: room.id,
                guestId: finalGuestId,
                createdByUserId: data.createdByUserId, // <-- New field
                type: data.type,
                description: data.description,
                isUrgent: data.priority === 'HIGH' || data.isUrgent,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string, role: string, userId: string, filter?: { status?: RequestStatus; roomId?: string }) {
        const where: any = { tenantId, ...filter };

        // Restriction: Staff and Guest only see their own requests (created by them)
        // Note: For Guests, we also show requests where they are the 'guestId' (e.g. opened by Reception for them)
        if (role !== 'ADMIN' && role !== 'RECEPTION' && role !== 'SAAS_ADMIN') {
            where.OR = [
                { createdByUserId: userId },
                { guestId: userId }
            ];
        }

        return prisma.guestRequest.findMany({
            where,
            include: { guest: { select: { name: true } }, room: true, assignedTo: { select: { name: true, avatar: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: string, data: { status: RequestStatus; resolvedAt?: Date; assignedToId?: string }, tenantId: string) {
        const request = await prisma.guestRequest.findFirst({ where: { id, tenantId } });
        if (!request) throw new AppError('Request not found', 404);

        if (data.status === RequestStatus.COMPLETED && !data.resolvedAt) {
            data.resolvedAt = new Date();
        }

        return prisma.guestRequest.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, tenantId: string) {
        const request = await prisma.guestRequest.findFirst({ where: { id, tenantId } });
        if (!request) throw new AppError('Request not found', 404);
        return prisma.guestRequest.delete({ where: { id } });
    }

    async convertToTask(id: string, data: any, tenantId: string) {
        const request = await prisma.guestRequest.findFirst({
            where: { id, tenantId },
            include: { room: true }
        });
        if (!request) throw new AppError('Solicitação não encontrada', 404);

        // We use prisma directly to avoid circular dependency with TaskService if needed,
        // but TaskService handles checklist logic. Let's see if we can import it.
        // For simplicity and to ensure checklist logic works, we'll create the task here.
        
        let checklistItems: any[] = [];
        if (data.templateId) {
            const template = await prisma.checklistTemplate.findUnique({
                where: { id: data.templateId },
                include: { items: true },
            });
            if (template) {
                checklistItems = template.items.map(item => ({
                    text: item.text,
                    subtext: item.subtext,
                    order: item.order,
                    checked: false,
                }));
            }
        }

        const task = await prisma.task.create({
            data: {
                title: `${request.type} - Quarto ${request.room.number}`,
                description: request.description,
                roomId: request.roomId,
                assignedToId: data.assignedToId,
                priority: data.priority || (request.isUrgent ? 'HIGH' : 'MEDIUM'),
                tenantId,
                requestId: request.id,
                status: 'PENDING',
                checklistItems: {
                    create: checklistItems
                }
            }
        });

        // Update Request status
        await prisma.guestRequest.update({
            where: { id },
            data: {
                status: RequestStatus.ASSIGNED,
                assignedToId: data.assignedToId
            }
        });

        return task;
    }
}
