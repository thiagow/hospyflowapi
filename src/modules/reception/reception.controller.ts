import { Request, Response, NextFunction } from 'express';
import { ReceptionService } from './reception.service';
import { AuthenticatedRequest } from '../../types';

export class ReceptionController {
    private service: ReceptionService;

    constructor() {
        this.service = new ReceptionService();
    }

    async checkIn(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const guest = await this.service.checkIn(req.body, tenantId);
            res.status(201).json({ status: 'success', data: guest });
        } catch (err) {
            next(err);
        }
    }

    async checkOut(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) throw new Error('Tenant ID required');

            const { guestId } = req.params;
            await this.service.checkOut(guestId as string, tenantId);
            res.status(200).json({ status: 'success', message: 'Check-out successful' });
        } catch (err) {
            next(err);
        }
    }
}
