import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { AuthenticatedRequest } from '../../types';

export class DashboardController {
    private service: DashboardService;

    constructor() {
        this.service = new DashboardService();
    }

    async getAdminStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const stats = await this.service.getAdminStats(tenantId);
            res.status(200).json(stats);
        } catch (err) {
            next(err);
        }
    }

    async getSaaSStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const stats = await this.service.getSaaSStats();
            res.status(200).json(stats);
        } catch (err) {
            next(err);
        }
    }

    async getGuestStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            const tenantId = req.user?.tenantId;

            if (!userId || !tenantId) throw new Error('User/Tenant ID required');

            const stats = await this.service.getGuestStats(userId, tenantId);
            res.status(200).json(stats);
        } catch (err) {
            next(err);
        }
    }
}
