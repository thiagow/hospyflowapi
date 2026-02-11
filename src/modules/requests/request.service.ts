import { RequestStatus, RequestType } from '@prisma/client';
import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class RequestService {
    async create(data: { guestId: string; roomId: string; type: RequestType; description?: string; isUrgent?: boolean }, tenantId: string) {
        // Verify guest belongs to room and tenant
        const guest = await prisma.user.findFirst({
            where: { id: data.guestId, tenantId, roomId: data.roomId },
        });

        if (!guest) throw new AppError('Guest not authorized for this room', 403);

        return prisma.guestRequest.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string, filter?: { status?: RequestStatus; roomId?: string }) {
        return prisma.guestRequest.findMany({
            where: { tenantId, ...filter },
            include: { guest: { select: { name: true } }, room: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async update(id: string, data: { status: RequestStatus; resolvedAt?: Date }, tenantId: string) {
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
}
