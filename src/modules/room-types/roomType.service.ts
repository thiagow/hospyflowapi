import prisma from '../../shared/prisma';
import { AppError } from '../../shared/errors';

export class RoomTypeService {
    async create(data: any, tenantId: string) {
        return prisma.roomType.create({
            data: {
                ...data,
                tenantId,
            },
        });
    }

    async findAll(tenantId: string) {
        return prisma.roomType.findMany({
            where: { tenantId },
        });
    }

    async findById(id: string, tenantId: string) {
        const roomType = await prisma.roomType.findFirst({
            where: { id, tenantId },
        });

        if (!roomType) {
            throw new AppError('Room Type not found', 404);
        }

        return roomType;
    }

    async update(id: string, data: any, tenantId: string) {
        await this.findById(id, tenantId);
        return prisma.roomType.update({
            where: { id },
            data,
        });
    }

    async delete(id: string, tenantId: string) {
        await this.findById(id, tenantId);

        const roomsUsingType = await prisma.room.count({
            where: { typeId: id },
        });

        if (roomsUsingType > 0) {
            throw new AppError('Cannot delete Room Type in use by rooms', 400);
        }

        return prisma.roomType.delete({
            where: { id },
        });
    }
}
