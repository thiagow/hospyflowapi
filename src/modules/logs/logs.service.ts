import prisma from '../../shared/prisma';

export class LogsService {
    async getAll(tenantId: string, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [logs, total] = await Promise.all([
            prisma.systemLog.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: { user: { select: { name: true } } }
            }),
            prisma.systemLog.count({ where: { tenantId } })
        ]);

        return {
            logs,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }
}
