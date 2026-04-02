import prisma from '../../shared/prisma';

export class DashboardService {
    async getAdminStats(tenantId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [
            pendingTasks,
            completedTasks,
            pendingRequests,
            completedRequests,
            pendingFeedbacks,
            dailyCheckIns,
            dailyCheckOuts,
            totalRooms,
            occupiedRooms,
            recentLogs
        ] = await Promise.all([
            prisma.task.count({ where: { tenantId, status: 'PENDING' } }),
            prisma.task.count({ where: { tenantId, status: 'COMPLETED' } }),
            prisma.guestRequest.count({ where: { tenantId, status: 'PENDING' } }),
            prisma.guestRequest.count({ where: { tenantId, status: 'COMPLETED' } }),
            prisma.feedback.count({ where: { tenantId } }),
            prisma.user.count({
                where: {
                    tenantId,
                    role: 'GUEST',
                    checkinDate: { gte: today, lt: tomorrow }
                }
            }),
            prisma.user.count({
                where: {
                    tenantId,
                    role: 'GUEST',
                    checkoutDate: { gte: today, lt: tomorrow }
                }
            }),
            prisma.room.count({ where: { tenantId } }),
            prisma.room.count({ where: { tenantId, status: 'OCCUPIED' } }),
            prisma.activityLog.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: { user: { select: { name: true } } }
            })
        ]);

        const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

        return {
            pendingTasks,
            completedTasks,
            pendingRequests,
            completedRequests,
            pendingFeedbacks,
            checkIns: dailyCheckIns,
            checkOuts: dailyCheckOuts,
            occupancyRate,
            totalRooms,
            occupiedRooms,
            recentLogs
        };
    }

    async getSaaSStats() {
        const [
            activeClients,
            newClientsThisMonth,
            plansDistribution
        ] = await Promise.all([
            prisma.tenant.count({ where: { status: 'ACTIVE' } }),
            prisma.tenant.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            }),
            prisma.tenant.groupBy({
                by: ['planId'],
                _count: {
                    planId: true
                }
            })
        ]);

        // Enrich plan distribution with plan names
        const plans = await prisma.plan.findMany({
            where: { id: { in: plansDistribution.map(p => p.planId) } },
            select: { id: true, name: true }
        });

        const formattedPlanStats = plansDistribution.map(item => {
            const plan = plans.find(p => p.id === item.planId);
            return {
                name: plan?.name || 'Unknown',
                count: item._count.planId
            };
        });

        return {
            activeClients,
            newClientsThisMonth,
            formattedPlanStats
        };
    }

    async getGuestStats(userId: string, tenantId: string) {
        const guest = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                room: true
            }
        });

        if (!guest) throw new Error('Guest not found');

        // Logic to check if room is clean?
        // For now returning basic info
        return {
            guestName: guest.name,
            roomNumber: guest.room?.number,
            checkOut: guest.checkoutDate,
            roomStatus: guest.room?.status
        };
    }
}
