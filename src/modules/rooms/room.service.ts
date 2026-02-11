import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class RoomService {
    async create(data: any, tenantId: string) {
        const existing = await prisma.room.findUnique({
            where: {
                number_tenantId: {
                    number: data.number,
                    tenantId,
                },
            },
        });

        if (existing) {
            throw new AppError('Room number already exists', 400);
        }

        return prisma.room.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return prisma.room.findMany({
            where: { tenantId },
            include: { type: true },
        });
    }

    async findById(id: string, tenantId: string) {
        const room = await prisma.room.findFirst({
            where: { id, tenantId },
            include: { type: true },
        });

        if (!room) {
            throw new AppError('Room not found', 404);
        }

        return room;
    }

    async update(id: string, data: any, tenantId: string) {
        await this.findById(id, tenantId);
        return prisma.room.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, tenantId: string) {
        await this.findById(id, tenantId);
        return prisma.room.delete({
            where: { id },
        });
    }
}
