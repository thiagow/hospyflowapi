import { Response, NextFunction } from 'express';
import { LogsService } from './logs.service';
import { AuthenticatedRequest } from '../../types';

export class LogsController {
    private service: LogsService;

    constructor() {
        this.service = new LogsService();
    }

    async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.service.getAll(tenantId, page, limit);
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }
}
