import prisma from '../../shared/prisma';

export class FeedbackService {
    async create(data: { guestId: string; roomId: string; cleaningRating: number; serviceRating: number; comment?: string; tags?: string[] }, tenantId: string) {
        return prisma.feedback.create({
            data: {
                ...data,
                tenantId,
            },
            include: {
                guest: { select: { name: true } },
                room: { select: { number: true } },
            },
        });
    }

    async findAll(tenantId: string) {
        return prisma.feedback.findMany({
            where: { tenantId },
            include: {
                guest: { select: { name: true } },
                room: { select: { number: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
